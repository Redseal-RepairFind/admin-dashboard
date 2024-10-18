"use client";

import { useState } from "react";
// import { analytics } from "../api/analytics";
import { customers } from "../api/customers";

import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type RouteType = {
  route: "customers" | "contractors" | "disputes" | "jobs" | "job-emegercy";
};

const useAnalyticData = (
  route: "customers" | "contractors" | "disputes" | "jobs" | "emergencies"
) => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // const { mutateAsync: SuspendCustomer } = useMutation(
  //   analytics.getCustomerAnalytics
  // );
  const { data: customerData, isLoading: loadingCustomers } = useQuery(
    ["CustomersAnalytics"],
    () => {
      return customers.getAnalytics(route);
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const router = useRouter();

  return {
    customerData,
    loadingCustomers,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
  };
};

export default useAnalyticData;
