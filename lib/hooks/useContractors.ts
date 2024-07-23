import { contractors } from "../api/contractors";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useContractors = () => {
  const { mutateAsync: SuspendContractor } = useMutation(
    contractors.suspendContractor
  );

  const [search, setSearch] = useState("");

  const { data: contractorData, isLoading: loadingContractors } = useQuery(
    ["Contractors", search],
    () => {
      return contractors.getContractors({ search });
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const router = useRouter();

  return {
    contractorData,
    loadingContractors,
    SuspendContractor,
    setSearch,
    search,
  };
};

export default useContractors;
