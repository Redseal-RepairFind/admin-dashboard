"use client";

import { useState } from "react";
import { customers } from "../api/customers";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

const useCustomers = () => {
  //   const [perPage, setPerPage] = useState(10);
  //   const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const searchParams = useSearchParams();

  const currentPage = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;

  const { mutateAsync: SuspendCustomer } = useMutation(
    customers.suspendCustomer
  );
  const { data: customerData, isLoading: loadingCustomers } = useQuery(
    ["Customers", Number(perPage), Number(currentPage), search],
    () => {
      return customers.getCustomers({
        page: Number(currentPage),
        limit: Number(perPage),
        search,
      });
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const router = useRouter();

  return {
    customerData,
    loadingCustomers,
    SuspendCustomer,
    perPage,
    currentPage,
    search,
    setSearch,
  };
};

export default useCustomers;
