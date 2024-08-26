import apiClient from "./apii";

const client = apiClient();

export const analytics = {
  getAnalytics: () => client.get(`/admin/analytics`).then(({ data }) => data),

  getJobs: ({ page, limit }: { page: any; limit: any }) =>
    client
      .get(`/admin/jobs?page=${page}&limit=${limit}`)
      .then(({ data }) => data),
};
