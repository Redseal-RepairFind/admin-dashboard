import { gst } from "../api/gst";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useGst = () => {
  const [gstType, setGstType] = useState("pending");

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
  };
};

export default useGst;
