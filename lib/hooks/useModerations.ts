import { useMutation, useQuery } from "react-query";
import { contractors } from "../api/contractors";

export const useModerations = () => {
  const { mutateAsync: moderateImg } = useMutation(contractors.moderateImg);

  const {
    data: moderationsData,
    isLoading: isLoadingModerationsData,
    isRefetching: isRefetchingMods,
    refetch: refetchMode,
  } = useQuery<any>(["Moderations"], () => contractors.getAllModerations());

  return {
    moderationsData,
    isLoadingModerationsData,
    isRefetchingMods,
    refetchMode,
    moderateImg,
  };
};
