import apiClient from "./apii";

const client = apiClient();

export const contractors = {
  getContractors: ({
    page,
    limit,
    search,
  }: {
    page: any;
    limit: any;
    search: any;
  }) =>
    client
      .get(
        `/admin/contractors?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ""
        }`
      )
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
