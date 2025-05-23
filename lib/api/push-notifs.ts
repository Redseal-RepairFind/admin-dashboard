import apiClient from "./apii";

const client = apiClient();

const url = "/admin/marketing";
export const campaigns = {
  getAllCampaigns: ({
    page,
    limit,
    channels,
  }: {
    page: number;
    limit: number;
    channels?: string;
  }) =>
    client
      .get(
        `${url}/campaigns?limit=${limit}&page=${page}${
          channels ? `&channels=${channels}` : ""
        }`
      )
      .then(({ data }) => data),
  createCampaign: (payload: any) =>
    client.post(`${url}/campaigns`, payload).then(({ data }) => data),
  updateCampaign: ({ payload, id }: { payload: any; id: string }) =>
    client.patch(`${url}/campaigns/${id}`, payload).then(({ data }) => data),
  getUserSegments: () =>
    client.get(`${url}/user-segments`).then(({ data }) => data),
  sendPushNotification: (payload: any) =>
    client.post(`${url}/push-notifications`, payload).then(({ data }) => data),
  sendPushInboxMessage: (payload: any) =>
    client.post(`${url}/send-inbox-messages`, payload).then(({ data }) => data),
  getCampaignReports: (id: string) =>
    client.get(`${url}/campaigns/${id}/reports`).then(({ data }) => data),
  deleteCampaign: (id: string) =>
    client.delete(`${url}/campaigns/${id}`).then(({ data }) => data),
};
