import { useMutation, useQuery } from "react-query";
import { campaigns } from "../api/push-notifs";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useNotifsCampaign = () => {
  const params = useSearchParams();
  const limit = Number(params.get("perPage") || 10);
  const page = Number(params.get("page") || 1);
  const channel = params.get("channels") || "ALL";

  const [campaignData, setCampaignData] = useState([]);
  const { reportId } = useParams();
  const { mutateAsync: createCampaign } = useMutation(campaigns.createCampaign);
  const { mutateAsync: updateCampaign } = useMutation(campaigns.updateCampaign);
  const { mutateAsync: sendNotif } = useMutation(
    campaigns.sendPushNotification
  );
  const { mutateAsync: deleteCampaign } = useMutation(campaigns.deleteCampaign);
  const { mutateAsync: sendMessage } = useMutation(
    campaigns.sendPushInboxMessage
  );

  // console.log(channel);

  const {
    data: pushCampaigns,
    isLoading: isLoadingPushCamp,
    refetch: refetchPushCamps,
  } = useQuery(["notifications Campaign", page, limit, channel], () =>
    campaigns.getAllCampaigns({
      page,
      limit,
      channels: channel === "ALL" ? "" : channel,
    })
  );
  const {
    data: segments,
    isLoading: isLoadingSegments,
    refetch: refetchSegments,
  } = useQuery(["user-segments"], () => campaigns.getUserSegments());
  const {
    data: reports,
    isLoading: isLoadingreports,
    refetch: refetchReports,
  } = useQuery(
    ["campaign-reports", reportId],
    () => campaigns.getCampaignReports(reportId as string),
    {
      enabled: !!reportId,
    }
  );

  useEffect(() => {
    const rawData = pushCampaigns?.data?.data?.data;

    if (!Array.isArray(rawData)) return;

    const filtered = rawData.filter((item: any) => {
      const hasInbox = item?.channels?.includes("INBOX");
      return channel.toLowerCase() === "inbox" ? hasInbox : !hasInbox;
    });

    setCampaignData(filtered as []);
  }, [channel, pushCampaigns?.data?.data?.data]);

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
    campaignData,
    reports,
    isLoadingreports,
    refetchReports,
    deleteCampaign,
  };
};
