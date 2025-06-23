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

  giveManualCertn: ({ id }: { id: any }) =>
    client.post(`/admin/contractors/${id}/approve-certn`),
  deleteContractor: ({ id, payload }: { id: any; payload: any }) =>
    client.post(`/admin/contractors/${id}/delete`, payload),
  giveMultipleCertn: (payload: any) =>
    client.post(`/admin/contractors/multiple-certn-approvals`, payload),
  deleteMultipleContractors: (payload: any) =>
    client.post(`/admin/contractors/delete-multiple`, payload),
  unsuspend: (payload: { contractorIds: string[] }) =>
    client.post(`/admin/contractors/restore`, payload),
  getAllModerations: () =>
    client.get(`/admin/moderations`).then(({ data }) => data),
  moderateImg: ({
    id,
    payload,
  }: {
    id: string;
    payload: {
      comment: string;
      containsPII: boolean;
      containsExplicitContent: boolean;
    };
  }) =>
    client.post(`/admin/moderations/${id}`, payload).then(({ data }) => data),
};
