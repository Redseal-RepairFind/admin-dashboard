import { gst } from "../api/gst";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useGst = () => {
  const { data: contractorData, isLoading: loadingContractors } = useQuery(
    ["Contractor Info"],
    () => {
      return gst.getContractorDetails();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  return { contractorData, loadingContractors };
};

export default useGst;
