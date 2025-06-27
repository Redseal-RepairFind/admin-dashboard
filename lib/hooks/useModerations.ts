import { useMutation, useQuery } from "react-query";
import { contractors } from "../api/contractors";
import { useSearchParams } from "next/navigation";

export const useModerations = () => {
  const { mutateAsync: moderateImg } = useMutation(contractors.moderateImg);
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;
  const isModerated = searchParams.get("isModerated") || "";
  const {
    data: moderationsData,
    isLoading: isLoadingModerationsData,
    isRefetching: isRefetchingMods,
    refetch: refetchMode,
  } = useQuery<any>(["Moderations", isModerated, currentPage, perPage], () =>
    contractors.getAllModerations(
      Boolean(isModerated),
      Number(currentPage),
      Number(perPage)
    )
  );

  return {
    moderationsData,
    isLoadingModerationsData,
    isRefetchingMods,
    refetchMode,
    moderateImg,
  };
};
