import { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { promotions } from "../api/promotions";
import { useQuery, useMutation } from "react-query";
import { formatDate } from "@/lib/utils/format-date";

export function usePromotion() {
  const { mutateAsync: CreatePromo } = useMutation(promotions.createPromo);
  // const { mutateAsync: UpdatePromo } = useMutation(promotions.updatePromo);

  const { mutateAsync: deletePromo } = useMutation(promotions.deletePromo);

  const {
    data: Promotions,
    isLoading: loadingPromo,
    refetch: refetchPromo,
  } = useQuery(
    ["promotions"],
    () => {
      return promotions.getPromo();
    },
    { cacheTime: 30000, staleTime: 30000, refetchOnWindowFocus: true }
  );

  return {
    Promotions,
    loadingPromo,
    refetchPromo,
    CreatePromo,
    // UpdatePromo,
    deletePromo,
  };
}
