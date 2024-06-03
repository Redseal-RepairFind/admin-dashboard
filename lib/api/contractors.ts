import apiClient from "./apii";

const client = apiClient();

export const contractors = {
  getContractors: () =>
    client
      .get("/admin/contractor/detail?page=1&limit=20  ")
      .then(({ data }) => data),

  getContractorDetails: ({ id }: { id: any }) =>
    client.get(`/admin/contractor/detail/${id}`).then(({ data }) => data),

  getContractorHistory: ({ id }: { id: any }) =>
    client
      .get(`/admin/customer/job/detail/${id}?page=1&limit=50`)
      .then(({ data }) => data),
};
