import { customers } from "../api/customers";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useCustomers = () => {
  const { mutateAsync: SuspendCustomer } = useMutation(
    customers.suspendCustomer
  );
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
    SuspendCustomer,
  };
};

export default useCustomers;
