import { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { customers } from "../api/customers";
import { useQuery } from "react-query";
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
) {
  const searchParams = useSearchParams();
  const param = new URLSearchParams(window.location.search);
  const initialState = useMemo(() => new Date(1999, 9, 14), []);
  const [startDate, setStartDate] = useState(initialState);
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [queryedList, setQueryedList] = useState<any[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [criteria, setCriteria] = useState("fullName");

  const params = searchParams.get("sort") || "All";
  const currentPage = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";

  const pathname = usePathname();
  const router = useRouter();

  // Use effect to handle sorting by date

  // console.log(params);
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
      setStartDate(initialState);
      setEndDate(now);
    }

    setCriteria(critria);
  }, [params, initialState, searchParams]);

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
      // searchTerm,
    ],
    () =>
      params === "All"
        ? customers.getAnalytics({
            route,
            limit: Number(perPage) || 10,
            page: Number(currentPage) || 1,
            criteria: criteria,
            status,
            type,
            // search: searchTerm,
          })
        : customers.getSortingAnalytics({
            page: Number(currentPage),
            limit: Number(perPage),
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            route,
            criteria: criteria,
            status,
            type,
            // search: searchTerm,
          }),
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  // all data for search

  const { isLoading: loadingAllData, data: allData } = useQuery(
    ["allData", route],
    () => customers.getAllData({ route })
  );

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

  // function handleQuery(value: string) {
  // if (value === "") {
  //   setIsQuerying(false);
  //   setSearchTerm("");
  //   return;
  // }

  // setSearchTerm(value);
  // setIsQuerying(true);
  // }

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
  };
}
