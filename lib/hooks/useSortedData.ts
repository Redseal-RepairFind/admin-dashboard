import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { customers } from "../api/customers";
import { useQuery } from "react-query";
import { formatDate } from "@/lib/utils/format-date";

export function useSortedData(
  route: "customers" | "contractors" | "disputes" | "jobs" | "emergencies"
) {
  const searchParams = useSearchParams();

  // Use a memoized initial state for the initial date
  const initialState = useMemo(() => new Date(2023, 9, 14), []);

  // States for start and end dates
  const [startDate, setStartDate] = useState(initialState);
  const [endDate, setEndDate] = useState(new Date()); // End date is now set to current date

  const params = searchParams.get("sort") || "All";
  const currentPage = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;

  useEffect(() => {
    const sortParam = params.toLowerCase().replaceAll("_", " ");

    const now = new Date(); // Current date for reference

    if (sortParam === "last 24h") {
      setStartDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)); // 24 hours ago
      setEndDate(now); // Current date
    } else if (sortParam === "last 7 days") {
      setStartDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
      setEndDate(now); // Current date
    } else if (sortParam === "last 30 days") {
      setStartDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
      setEndDate(now); // Current date
    } else {
      // Reset to the initial state if no sort parameter matches
      setStartDate(initialState);
      setEndDate(new Date());
    }
  }, [params, initialState]);

  const {
    data: sortedData,
    isLoading: loadingSortedData,
    error,
  } = useQuery(
    [
      "sortData",
      route,
      startDate,
      endDate,
      Number(perPage),
      Number(currentPage),
    ],
    () => {
      return customers.getSortingAnalytics({
        page: Number(currentPage),
        limit: Number(perPage),
        startDate: formatDate(startDate), // Pass start date to the query
        endDate: formatDate(endDate), // Pass end date to the query
        route,
      });
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  if (error) {
    console.error("Error fetching sorted data:", error);
  }

  return {
    sortedData,
    loadingSortedData,
  };
}
