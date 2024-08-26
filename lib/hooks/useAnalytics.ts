import { analytics } from "../api/analytics";
import { useMutation, useQuery } from "react-query";

const useAnalytics = () => {
  const { data, isLoading } = useQuery(
    ["Analytics"],
    () => {
      return analytics.getAnalytics();
    },
    {
      cacheTime: 30000,
      staleTime: 30000,
      refetchOnWindowFocus: true,
      select: (data) => data?.data,
    }
  );

  return { data, isLoading };
};

export default useAnalytics;
