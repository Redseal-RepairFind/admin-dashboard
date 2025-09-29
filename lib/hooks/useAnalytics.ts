"use client";
import { useState } from "react";
import { analytics, getDummyMetrics } from "../api/analytics";
import { useMutation, useQuery } from "react-query";

const useAnalytics = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // const [dummyMetrics, setDummyMetrics] = useState(null);

  const { data, isLoading } = useQuery(
    ["Analytics"],
    () => {
      return analytics.getAnalytics();
    },
    {
      cacheTime: 30000,
      staleTime: 30000,
      refetchOnWindowFocus: true,
      select: (data) => data?.data,
    }
  );

  const { data: jobs, isLoading: loadingJobs } = useQuery(
    ["Jobs", currentPage, perPage],
    () => {
      return analytics.getJobs({ page: currentPage, limit: perPage });
    },
    {
      cacheTime: 30000,
      staleTime: 30000,
      refetchOnWindowFocus: true,
      select: (data) => data?.data,
    }
  );

  const { data: dummyMetrics, isLoading: loadingMetrics } = useQuery(
    "metrics",
    () => {
      return getDummyMetrics();
    },
    {
      cacheTime: 30000,
      staleTime: 30000,
      refetchOnWindowFocus: true,
      select: (data) => data,
    }
  );

  function getMetric(name: string) {
    const metryc = dummyMetrics?.find(
      (metric) => name.toLowerCase() === metric?.metric.toLowerCase()
    );

    const metrycSTotal = metryc?.data
      .map((dt) => {
        if ("customers" in dt && "contractors" in dt) {
          // For metrics with both customers and contractors
          return dt.customers + dt.contractors;
        } else if ("count" in dt) {
          // For metrics with a count field
          return dt.count;
        }
        return 0; // Default if neither field exists
      })
      .reduce((acc, curv) => acc + curv, 0);

    return { metryc, metrycSTotal };
  }

  return {
    data,
    isLoading,
    jobs,
    loadingJobs,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    dummyMetrics,
    loadingMetrics,
    getMetric,
  };
};

export default useAnalytics;
