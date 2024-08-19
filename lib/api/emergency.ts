import apiClient from "./apii";

const client = apiClient();

export const emergency = {
  getEmergencyList: (type: string) =>
    client
      .get(`/admin/emergencies?page=1&limit=20&status=${type}`)
      .then(({ data }) => data),

  getSingleEmergency: (id: string) =>
    client.get(`/admin/emergencies/${id}`).then(({ data }) => data),

  acceptEmergency: (id: string) =>
    client.post(`/admin/emergencies/${id}/accept`).then(({ data }) => data),

  resolveEmergency: (id: string) =>
    client.post(`/admin/emergencies/${id}/accept`).then(({ data }) => data),
};
