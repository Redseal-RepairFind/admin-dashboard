import { useMutation, useQuery } from "react-query";
import { campaigns } from "../api/push-notifs";
import { useSearchParams } from "next/navigation";

export const useNotifsCampaign = () => {
  const params = useSearchParams();
  const limit = Number(params.get("perPage") || 10);
  const page = Number(params.get("page") || 1);

  const { mutateAsync: createCampaign } = useMutation(campaigns.createCampaign);
  const { mutateAsync: updateCampaign } = useMutation(campaigns.updateCampaign);
  const { mutateAsync: sendNotif } = useMutation(
    campaigns.sendPushNotification
  );
  const { mutateAsync: sendMessage } = useMutation(
    campaigns.sendPushInboxMessage
  );

  const {
    data: pushCampaigns,
    isLoading: isLoadingPushCamp,
    refetch: refetchPushCamps,
  } = useQuery(["notifications Campaign", page, limit], () =>
    campaigns.getAllCampaigns({
      page,
      limit,
    })
  );
  const {
    data: segments,
    isLoading: isLoadingSegments,
    refetch: refetchSegments,
  } = useQuery(["user-segments"], () => campaigns.getUserSegments());

  return {
    pushCampaigns,
    isLoadingPushCamp,
    refetchPushCamps,
    createCampaign,
    segments,
    isLoadingSegments,
    refetchSegments,
    updateCampaign,
    sendNotif,
    sendMessage,
  };
};
