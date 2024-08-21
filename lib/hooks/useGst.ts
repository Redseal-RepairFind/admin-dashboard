import { gst } from "../api/gst";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useGst = () => {
  const [gstType, setGstType] = useState("PENDING");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { mutateAsync: ChangeStatus } = useMutation(gst.changeStatus);

  const {
    data: contractorData,
    isLoading: loadingContractors,
    refetch,
  } = useQuery(
    ["Contractor Info", gstType],
    () => {
      return gst.getContractorDetails({ type: gstType });
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  return {
    contractorData,
    loadingContractors,
    gstType,
    setGstType,
    ChangeStatus,
    refetch,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
  };
};

export default useGst;
