import apiClient from "./apii";

const client = apiClient();

export const emergency = {
  getEmergencyList: (type: string) =>
    client
      .get(`/admin/emergecy/${type}?page=1&limit=20`)
      .then(({ data }) => data),

  acceptEmergency: (payload: string) =>
    client.post(`/admin/emergecy/accept`, payload).then(({ data }) => data),

  resolveEmergency: (payload: string) =>
    client.post(`/admin/emergecy/resolved`, payload).then(({ data }) => data),
};
