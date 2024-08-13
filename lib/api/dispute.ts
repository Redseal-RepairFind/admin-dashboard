import apiClient from "./apii";

const client = apiClient();

const user = JSON.parse(
  sessionStorage.getItem("repairfind_session_user") || ""
);

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
        }&status=${status}${
          status === "ONGOING" ? `&arbitrator=${user?._id} ` : ""
        }`
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
      .post(
        `/admin/disputes/${id}/${
          type === "revisit" ? "enable-revisit" : `refund-${type}`
        }`,
        payload
      )
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
