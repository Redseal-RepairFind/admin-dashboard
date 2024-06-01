import { customers } from "../api/customers";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useCustomers = () => {
  const { data: customerData, isLoading: loadingCustomers } = useQuery(
    ["Customers"],
    () => {
      return customers.getCustomers();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const router = useRouter();

  return {
    customerData,
    loadingCustomers,
  };
};

export default useCustomers;
