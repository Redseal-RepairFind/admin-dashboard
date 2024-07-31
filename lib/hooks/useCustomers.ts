"use client";

import { useState } from "react";
import { customers } from "../api/customers";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useCustomers = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { mutateAsync: SuspendCustomer } = useMutation(
    customers.suspendCustomer
  );
  const { data: customerData, isLoading: loadingCustomers } = useQuery(
    ["Customers", perPage, currentPage],
    () => {
      return customers.getCustomers({ page: currentPage, limit: perPage });
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const router = useRouter();

  return {
    customerData,
    loadingCustomers,
    SuspendCustomer,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
  };
};

export default useCustomers;
