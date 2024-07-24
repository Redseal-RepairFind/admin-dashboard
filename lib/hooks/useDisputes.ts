import { dispute } from "../api/dispute";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useDisputes = () => {
  const [status, setStatus] = useState("OPEN");

  const {
    data: disputes,
    isLoading: loadingDisputes,
    refetch,
  } = useQuery(
    ["Dispute List", status],
    () => {
      return dispute.getDisputes({ status });
    },
    { cacheTime: 100, staleTime: 100, refetchOnWindowFocus: true }
  );

  return { status, setStatus, disputes, loadingDisputes };
};

export default useDisputes;
