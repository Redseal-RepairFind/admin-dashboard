import { contractors } from "../api/contractors";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useContractors = () => {
  const { mutateAsync: SuspendContractor } = useMutation(
    contractors.suspendContractor
  );

  const { data: contractorData, isLoading: loadingContractors } = useQuery(
    ["Contractors"],
    () => {
      return contractors.getContractors();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const router = useRouter();

  return {
    contractorData,
    loadingContractors,
    SuspendContractor,
  };
};

export default useContractors;
