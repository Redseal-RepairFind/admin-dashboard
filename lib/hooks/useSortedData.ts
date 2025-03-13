import { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { customers } from "../api/customers";
import { useQuery, useMutation } from "react-query";
import { formatDate } from "@/lib/utils/format-date";

export function useSortedData(
  route:
    | "customers"
    | "contractors"
    | "disputes"
    | "jobs"
    | "emergencies"
    | "jobdays"
    | "transactions"
    | "issues"
) {
  const searchParams = useSearchParams();
  const param = new URLSearchParams(window.location.search);
  const initialState = useMemo(() => new Date(1999, 9, 14), []);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [searchTerm, setSearchTerm] = useState("");
  const [queryedList, setQueryedList] = useState<any[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [statusDataToRender, setStatusDataToRender] = useState();
  const [transactionsToRender, setTransactionsToRender] = useState<any>();

  const params = searchParams.get("sort") || "All";
  const currentPage = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;
  const status = searchParams.get("status") || "OPEN";
  const type = searchParams.get("type") || "";
  const listStatus = searchParams.get("listStatus") || "All";
  const customersWithBooking = searchParams.get("customersWithBooking") || "";
  const accountStatus = searchParams.get("accountStatus") || "";
  const transactionStatus = searchParams.get("status") || "";
  const issuesStatus = searchParams.get("issuesStatus") || "PENDING";

  const pathname = usePathname();
  const router = useRouter();

  const { mutateAsync: acceptIssue, isLoading: isAccepting } = useMutation(
    customers.acceptIssue
  );

  const { mutateAsync: strikeUser } = useMutation(customers.sanctionUser);
  const { mutateAsync: SanctionUser } = useMutation(
    customers.sanctionDisputeUser
  );

  // Use effect to handle sorting by date

  // console.log(status);
  useEffect(() => {
    const sortParam = params.toLowerCase().replaceAll("_", " ");
    const now = new Date();
    const critria = searchParams.get("sortList") || "firstName";

    if (sortParam === "last 24h") {
      setStartDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
      setEndDate(now);
    } else if (sortParam === "last 7 days") {
      setStartDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
      setEndDate(now);
    } else if (sortParam === "last 30 days") {
      setStartDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
      setEndDate(now);
    } else {
      setStartDate("");
      setEndDate("");
    }

    setCriteria(critria);
  }, [params, initialState, searchParams, criteria]);
  // console.log(startDate);

  // Fetch sorted data
  const {
    data: sortedData,
    isLoading: loadingSortedData,
    refetch,
    error,
  } = useQuery(
    [
      "sortData",
      route,
      startDate,
      endDate,
      Number(perPage),
      Number(currentPage),
      status,
      type,
      customersWithBooking,
      accountStatus,
      criteria,
      isQuerying,
      searchTerm,
    ],
    () =>
      params === "All"
        ? customers.getAnalytics({
            route,
            limit: Number(perPage) || 10,
            page: searchTerm ? 1 : Number(currentPage) || 1,
            criteria: criteria,
            status:
              route === "disputes"
                ? status
                : route === "transactions"
                ? transactionStatus
                : issuesStatus,
            type,
            customersWithBooking: !!customersWithBooking,
            accountStatus,
            search: searchTerm,
          })
        : customers.getSortingAnalytics({
            page: searchTerm ? 1 : Number(currentPage) || 1,
            limit: Number(perPage),
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            route,
            criteria: criteria,
            status:
              route === "disputes"
                ? status
                : route === "transactions"
                ? transactionStatus
                : issuesStatus,
            type,
            customersWithBooking: !!customersWithBooking,
            accountStatus,
            search: searchTerm,
          }),
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const {
    data: issuesData,
    isLoading: loadingIssues,
    refetch: refetchIssues,
  } = useQuery(
    [
      "issues",
      startDate,
      endDate,
      Number(perPage),
      Number(currentPage),
      criteria,
      issuesStatus,
    ],
    () =>
      customers.gettIssues({
        page: Number(currentPage) || 1,
        limit: Number(perPage) || 10,
        criteria: criteria,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        status: issuesStatus,
      }),
    {
      enabled: pathname === "/issues", // Fetch only when isQuerying is true
    }

    // { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  // all data for search

  const { isLoading: loadingAllData, data: allData } = useQuery(
    ["allData"],
    () => customers.getAllData({ route }),
    {
      enabled: isQuerying || (listStatus !== "All" && route.includes("jobs")), // Fetch only when isQuerying is true
    }
  );
  // const allData ={
  //   data:[]
  // }
  // console.log(transactionStatus);

  const handleFrontEndQuery = (value: string) => {
    if (value === "") {
      setIsQuerying(false);
      setQueryedList([]);
      setNotFound(false);
      setSearchTerm("");
    }
    // Clear the search parameter from the URL when the search term is empty

    setIsQuerying(true);
    param.set("sort", "All");
    param.set("page", "1");
    if (allData?.data) {
      // console.log(allData);
      const filteredArray = allData.data?.data.filter(
        (item: any) =>
          item?.name?.toLowerCase()?.includes(value.toLowerCase()) ||
          item?.contractor?.firstName
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          item?.contractor?.lastName
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          item?._id?.includes(value?.toLowerCase()) ||
          item?.disputer?.firstName?.includes(value.toLowerCase()) ||
          item?.disputer?.lastName?.includes(value.toLowerCase()) ||
          item?.fromUser?.name?.includes(value.toLowerCase()) ||
          item?.toUser?.name?.includes(value.toLowerCase()) ||
          item?.customer?.name?.toLowerCase()?.includes(value.toLowerCase()) ||
          item?.contractor?.name
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          item?.fromUser?.name?.toLowerCase()?.includes(value.toLowerCase()) ||
          item?.toUser?.name?.toLowerCase()?.includes(value.toLowerCase())
      );
      // Create a new object that retains the structure of sortedData

      if (filteredArray?.length > Number(perPage)) {
        // divide the total item by the filteredArray length this will give us the last page
        const lastPage = Math.ceil(filteredArray.length / Number(perPage));

        // console.log(lastPage);

        // if the page changes , then we display data accordingly, eg lperPage = 10, page 2 will display from index 10=> 19

        let pageData: any[];

        if (Number(currentPage) === 1) {
          pageData = filteredArray.slice(0, Number(perPage));
        } else if (Number(currentPage) > 1 && Number(currentPage) < lastPage) {
          pageData = filteredArray.slice(
            Number(perPage) * (Number(currentPage) - 1),
            Number(perPage) * Number(currentPage)
          );
        } else {
          pageData = filteredArray.slice(
            Number(perPage) * (Number(currentPage) - 1),
            filteredArray.length
          );
        }

        const updatedFilteredData = {
          ...sortedData,
          data: {
            ...sortedData.data, // Keep the metadata such as pagination, totalItems, etc.
            lastPage: lastPage,
            data: pageData, // Replace only the actual data array with the filtered results
          },
        };
        setQueryedList(updatedFilteredData);
      } else {
        const updatedFilteredData = {
          ...sortedData,
          data: {
            ...sortedData.data, // Keep the metadata such as pagination, totalItems, etc.
            data: filteredArray, // Replace only the actual data array with the filtered results
          },
        };
        setQueryedList(updatedFilteredData);
        if (filteredArray.length === 0) {
          setNotFound(true);
        } else {
          setNotFound(false);
        }
        // Update the URL with the new query parameters
        router.replace(`${pathname}?${param.toString()}`, {
          scroll: false,
        });
      }
    }
  };

  const handleQuery = (value: string) => {
    if (value === "") {
      setIsQuerying(false);
      setQueryedList([]);
      setNotFound(false);
      setSearchTerm("");
    }
    // Clear the search parameter from the URL when the search term is empty

    setIsQuerying(true);
    setSearchTerm(value);
  };

  // useEffect(() => {
  //   if (route === "transactions") {
  //     if (transactionStatus === "All") setTransactionsToRender(sortedData);
  //     else {
  //       const filteredData = allData?.data?.data.filter((data: any) =>
  //         data?.status.toLowerCase().includes(transactionStatus.toLowerCase())
  //       );

  //       const updatedFilteredData = {
  //         ...allData,
  //         data: {
  //           ...allData?.data, // Keep the metadata such as pagination, totalItems, etc.
  //           data: filteredData, // Replace only the actual data array with the filtered results
  //         },
  //       };
  //       setTransactionsToRender(updatedFilteredData);
  //     }
  //   }
  // }, [transactionStatus, allData, route, sortedData]);

  useEffect(() => {
    if (listStatus === "All") setStatusDataToRender(sortedData);
    else {
      let filteredArray;
      // if (route === "contractors") {
      //   data = allData?.data?.data.filter(
      //     (item: any) =>
      //       item?.accountStatus?.toLowerCase() === listStatus?.toLowerCase()
      //   );
      // }

      if (route === "jobs") {
        filteredArray = allData?.data?.data.filter((item: any) => {
          if (
            listStatus.toLowerCase() === "listing" ||
            listStatus === "request"
          ) {
            return item?.type?.toLowerCase().includes(listStatus);
          } else if (listStatus.toLowerCase() === "expired") {
            return (
              item?.status?.toLowerCase().includes(listStatus.toLowerCase()) ||
              item?.status?.toLowerCase().includes("decline")
            );
          } else if (listStatus.toLowerCase() === "booked") {
            return (
              item?.status?.toLowerCase().includes(listStatus.toLowerCase()) ||
              item?.status?.toLowerCase().includes("dispute") ||
              item?.status?.toLowerCase().includes("completed") ||
              item?.status?.toLowerCase().includes("canceled") ||
              item?.status?.toLowerCase().includes("ongoing")
            );
          } else if (listStatus.toLowerCase() === "completed") {
            return item?.status
              ?.toLowerCase()
              .includes(listStatus.toLowerCase());
          } else if (listStatus.toLowerCase() === "pending") {
            return item?.status
              ?.toLowerCase()
              .includes(listStatus.toLowerCase());
          } else if (listStatus.toLowerCase() === "accepted") {
            return (
              item?.status?.toLowerCase().includes("accepted") ||
              item?.status?.toLowerCase().includes("submitted")
            );
          }
          return item?.status
            ?.toLowerCase()
            .includes(listStatus?.toLowerCase());
        });
      } else if (route === "jobdays") {
        filteredArray = allData?.data?.data.filter((item: any) => {
          return item?.status
            ?.toLowerCase()
            .includes(listStatus?.toLowerCase());
        });

        console.log(filteredArray);
      }

      if (filteredArray?.length > Number(perPage)) {
        // divide the total item by the filteredArray length this will give us the last page
        const lastPage = Math.ceil(filteredArray.length / Number(perPage));

        // console.log(lastPage);

        // if the page changes , then we display data accordingly, eg lperPage = 10, page 2 will display from index 10=> 19

        let pageData: any[];

        if (Number(currentPage) === 1) {
          pageData = filteredArray.slice(0, Number(perPage));
        } else if (Number(currentPage) > 1 && Number(currentPage) < lastPage) {
          pageData = filteredArray.slice(
            Number(perPage) * (Number(currentPage) - 1),
            Number(perPage) * Number(currentPage)
          );
        } else {
          pageData = filteredArray.slice(
            Number(perPage) * (Number(currentPage) - 1),
            filteredArray.length
          );
        }

        const updatedFilteredData = {
          ...allData,
          data: {
            ...allData.data, // Keep the metadata such as pagination, totalItems, etc.
            lastPage: lastPage,
            data: pageData, // Replace only the actual data array with the filtered results
          },
        };
        setStatusDataToRender(updatedFilteredData);
        console.log(updatedFilteredData);
      } else {
        const updatedFilteredData = {
          ...allData,
          data: {
            ...allData?.data, // Keep the metadata such as pagination, totalItems, etc.
            data: filteredArray, // Replace only the actual data array with the filtered results
          },
        };
        setStatusDataToRender(updatedFilteredData);
      }
    }
  }, [listStatus, allData, perPage, route, currentPage, sortedData]);

  if (error) {
    console.error("Error fetching sorted data:", error);
  }

  return {
    sortedData,
    loadingSortedData,
    handleQuery,
    isQuerying,
    notFound,
    searchTerm,
    // Return the search term for further use if needed
    queryedList,
    setIsQuerying,
    refetch,
    statusDataToRender,
    acceptIssue,
    isAccepting,
    strikeUser,
    issuesData,
    loadingIssues,
    refetchIssues,
    transactionsToRender,
    SanctionUser,
    allData,
    setSearchTerm,
    handleFrontEndQuery,
  };
}
