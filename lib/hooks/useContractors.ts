import { contractors } from "../api/contractors";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useContractors = () => {
  const { mutateAsync: SuspendContractor } = useMutation(
    contractors.suspendContractor
  );

  const { mutateAsync: giveManualCertn, isLoading: isUpdating } = useMutation(
    contractors.giveManualCertn
  );
  const { mutateAsync: deleteContractor, isLoading: isDeleting } = useMutation(
    contractors.deleteContractor
  );

  const { mutateAsync: giveMultipleManualCertn } = useMutation(
    contractors.giveMultipleCertn
  );
  const { mutateAsync: deleteMultipleContractor } = useMutation(
    contractors.deleteMultipleContractors
  );

  const { mutateAsync: unsuspend, isLoading: unsuspending } = useMutation(
    contractors.unsuspend
  );
  const { mutateAsync: removeSanction, isLoading: unRemovingSanction } =
    useMutation(contractors.removeSanction);

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: contractorData,
    isLoading: loadingContractors,
    refetch: refetchContractors,
  } = useQuery(
    ["Contractors", search, perPage, currentPage],
    () => {
      return contractors.getContractors({
        search,
        limit: perPage,
        page: currentPage,
      });
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const { data: fullData, isLoading: loadingFullContractors } = useQuery(
    ["Contractors Full", search, perPage, currentPage],
    () => {
      return contractors.getContractors({
        search: "",
        limit: "1000000",
        page: "1",
      });
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  return {
    contractorData,
    loadingContractors,
    SuspendContractor,
    setSearch,
    search,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
    downloadData: fullData?.data,
    fullData,
    loadingFullContractors,
    giveManualCertn,
    isUpdating,
    deleteContractor,
    isDeleting,
    giveMultipleManualCertn,
    deleteMultipleContractor,
    unsuspend,
    unsuspending,
    refetchContractors,
    removeSanction,
    unRemovingSanction,
  };
};

export default useContractors;
