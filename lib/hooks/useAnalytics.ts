"use client";
import { useState } from "react";
import { analytics } from "../api/analytics";
import { useMutation, useQuery } from "react-query";

const useAnalytics = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  return {
    data,
    isLoading,
    jobs,
    loadingJobs,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
  };
};

export default useAnalytics;
