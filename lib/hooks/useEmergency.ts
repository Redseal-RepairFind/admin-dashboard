import { emergency } from "../api/emergency";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useEmergency = () => {
  const [type, setType] = useState("new");

  const { data: emergencyData, isLoading: loadingEmergencies } = useQuery(
    ["Emergency Info"],
    () => {
      return emergency.getEmergencyList(type);
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  return { type, setType, emergencyData, loadingEmergencies };
};

export default useEmergency;
