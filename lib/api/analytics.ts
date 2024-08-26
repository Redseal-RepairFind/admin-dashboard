import apiClient from "./apii";

const client = apiClient();

export const analytics = {
  getAnalytics: () => client.get(`/admin/analytics`).then(({ data }) => data),
};
