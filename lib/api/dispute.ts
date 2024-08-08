import apiClient from "./apii";

const client = apiClient();

export const dispute = {
  getDisputes: ({
    page,
    limit,
    search,
    status,
  }: {
    page: any;
    limit: any;
    search: any;
    status: string;
  }) =>
    client
      .get(
        `/admin/disputes?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ""
        }&status=${status}`
      )
      .then(({ data }) => data),

  getSingleDispute: (id?: any) =>
    client.get(`/admin/disputes/${id}`).then(({ data }) => data),

  acceptDispute: (id: string) =>
    client.post(`/admin/disputes/${id}/accept`).then(({ data }) => data),

  settleDispute: ({
    id,
    payload,
    type,
  }: {
    id: string;
    payload: any;
    type: string;
  }) =>
    client
      .post(`/admin/disputes/${id}/refund-${type}`, payload)
      .then(({ data }) => data),

  refundContractor: ({ id }: { id?: any }) =>
    client
      .post(`/admin/disputes/${id}/refund-contractor`)
      .then(({ data }) => data),

  refundCustomer: ({ id }: { id?: any }) =>
    client
      .post(`/admin/disputes/${id}/refund-customer`)
      .then(({ data }) => data),

  getConversation: () =>
    client
      .get(`admin/conversations?page=1&limit=10000`)
      .then(({ data }) => data),

  getSingleConversation: (id: any) =>
    client.get(`admin/conversations/${id}`).then(({ data }) => data),

  getConversationMessages: (id: any) =>
    client
      .get(`admin/conversations/${id}/messages?page=1&limit=10000&sort=asc`)
      .then(({ data }) => data),

  sendMessage: ({ id, payload }: { id: string; payload: any }) =>
    client
      .post(`/admin/conversations/${id}/messages`, payload)
      .then(({ data }) => data),
};
