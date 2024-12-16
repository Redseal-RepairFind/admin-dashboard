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
    | ""
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
    const critria = searchParams.get("sortList") || "";

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
  }, [params, initialState, searchParams]);
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
      // transactionStatus,
      // searchTerm,
    ],
    () =>
      params === "All"
        ? customers.getAnalytics({
            route,
            limit: Number(perPage) || 10,
            page: Number(currentPage) || 1,
            criteria: criteria,
            status: route === "disputes" ? status : transactionStatus,
            type,
            customersWithBooking: !!customersWithBooking,
            accountStatus,
            // search: searchTerm,
          })
        : customers.getSortingAnalytics({
            page: Number(currentPage),
            limit: Number(perPage),
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            route,
            criteria: criteria,
            status: route === "disputes" ? status : transactionStatus,
            type,
            customersWithBooking: !!customersWithBooking,
            accountStatus,
            // search: searchTerm,
          }),
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const {
    data: issuesData,
    isLoading: loadingIssues,
    refetch: refetchIssues,
  } = useQuery(
    ["issues", startDate, endDate, Number(perPage), Number(currentPage)],
    () =>
      customers.gettIssues({
        page: Number(currentPage) || 1,
        limit: Number(perPage) || 10,
        criteria: criteria,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
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
      enabled: isQuerying, // Fetch only when isQuerying is true
    }
  );
  // console.log(transactionStatus);

  const handleQuery = (value: string) => {
    setSearchTerm(value);

    if (value === "") {
      setIsQuerying(false);
      setQueryedList([]);
      setNotFound(false);
    }
    // Clear the search parameter from the URL when the search term is empty

    setIsQuerying(true);
    // param.set("sort", "All");
    // param.set("page", "1");

    if (allData?.data) {
      // console.log(allData);
      const filteredArray = allData.data.data.filter(
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
      let data;
      // if (route === "contractors") {
      //   data = allData?.data?.data.filter(
      //     (item: any) =>
      //       item?.accountStatus?.toLowerCase() === listStatus?.toLowerCase()
      //   );
      // }

      if (route === "jobs") {
        data = allData?.data?.data.filter((item: any) => {
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
      }
      if (route === "jobdays") {
        data = allData?.data?.data.filter((item: any) => {
          return item?.status
            ?.toLowerCase()
            .includes(listStatus?.toLowerCase());
        });
      }

      const updatedFilteredData = {
        ...allData,
        data: {
          ...allData?.data, // Keep the metadata such as pagination, totalItems, etc.
          data: data, // Replace only the actual data array with the filtered results
        },
      };
      setStatusDataToRender(updatedFilteredData);
    }
  }, [listStatus, sortedData, perPage, allData, route]);

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
  };
}
