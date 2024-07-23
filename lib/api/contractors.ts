import apiClient from "./apii";

const client = apiClient();

export const contractors = {
  getContractors: ({ search }: { search?: string }) =>
    client
      .get(`/admin/contractors?page=1&limit=20&search=${search}`)
      .then(({ data }) => data),

  suspendContractor: (payload: any) =>
    client
      .post("/admin/contractor/account/status", payload)
      .then(({ data }) => data),

  getContractorDetails: ({ id }: { id: any }) =>
    client.get(`/admin/contractors/${id}`).then(({ data }) => data),

  getContractorHistory: ({ id }: { id: any }) =>
    client
      .get(`/admin/customer/job/detail/${id}?page=1&limit=50`)
      .then(({ data }) => data),
};
