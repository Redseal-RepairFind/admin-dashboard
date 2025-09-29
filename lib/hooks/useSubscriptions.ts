import { useMutation, useQuery } from "react-query";
import { contractors } from "../api/contractors";
import { customers } from "../api/customers";
import { useSearchParams } from "next/navigation";

export const useSubscription = (type: "norm" | "sub") => {
  const searchParams = useSearchParams();

  const { mutateAsync: updateEquipmentAge, isLoading: isUpdateEquipmentAge } =
    useMutation(customers.updateEquipmentAge);

  const sub = searchParams.get("sub") || "all";
  const currentPage = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;
  const { data: subAnalytics, isLoading: isLoadingSubAnalytics } = useQuery({
    queryKey: ["sub_analytics"],
    queryFn: customers.getSubscriptionAnalytics,
    enabled: type === "sub",
  });

  const {
    data: subData,
    isLoading: loadingSubData,
    isRefetching: isRefetchingSubData,
    refetch: refetchSubData,
  } = useQuery({
    queryKey: ["subscription_customers", sub, perPage, currentPage],
    queryFn: () =>
      customers.getSubscriptionCustomers({
        limit: Number(perPage),
        page: Number(currentPage),
        equipmentAgeUnknown: sub?.toLowerCase() === "unknown",
      }),
    enabled: type === "sub",
  });

  return {
    subAnalytics,
    isLoadingSubAnalytics,
    subData,
    loadingSubData,
    isRefetchingSubData,
    refetchSubData,
    updateEquipmentAge,
    isUpdateEquipmentAge,
  };
};
