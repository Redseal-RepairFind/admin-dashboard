import { staff } from "../api/staff";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useStaff = () => {
  const { data: staffData, isLoading: loadingStaff } = useQuery(
    ["Staff"],
    () => {
      return staff.getStaff();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  const router = useRouter();

  return {
    staffData,
    loadingStaff,
  };
};

export default useStaff;
