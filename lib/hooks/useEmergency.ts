import { emergency } from "../api/emergency";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useEmergency = () => {
  const [type, setType] = useState("PENDING");

  const {
    data: emergencyData,
    isLoading: loadingEmergencies,
    refetch,
  } = useQuery(
    ["Emergency Info", type],
    () => {
      return emergency.getEmergencyList(type);
    },
    { cacheTime: 100, staleTime: 100, refetchOnWindowFocus: true }
  );

  const { mutateAsync: AcceptEmergency } = useMutation(
    emergency.acceptEmergency
  );
  const { mutateAsync: ResolveEmergency } = useMutation(
    emergency.resolveEmergency
  );

  const handleAccept = async (payload: any) => {
    toast.loading("Processing...");
    try {
      const response = await AcceptEmergency(payload);
      toast.remove();
      toast.success(response?.message);
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (e: any) {
      toast.remove();
      toast.error(e?.data?.response?.message);
    }
  };

  return {
    type,
    setType,
    emergencyData,
    loadingEmergencies,
    handleAccept,
    ResolveEmergency,
    refetch,
  };
};

export default useEmergency;
