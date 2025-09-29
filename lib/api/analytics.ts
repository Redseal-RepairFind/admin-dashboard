import apiClient from "./apii";
import json from "../../public/dummyMetrics.json";
const client = apiClient();

export const analytics = {
  getAnalytics: () => client.get(`/admin/analytics`).then(({ data }) => data),

  getJobs: ({ page, limit }: { page: any; limit: any }) =>
    client
      .get(`/admin/jobs?page=${page}&limit=${limit}`)
      .then(({ data }) => data),
};

export function getDummyMetrics() {
  try {
    return json;
  } catch (error) {
    console.error("Failed to fetch data:", error);

    return null;
  }
}

// export function getCustomerAnalytics() {}
