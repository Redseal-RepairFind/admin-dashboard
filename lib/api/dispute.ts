import apiClient from "./apii";

const client = apiClient();

export const dispute = {
  getDisputes: ({ status }: { status: string }) =>
    client
      .get(`/admin/disputes?page=1&limit=20&status=${status}`)
      .then(({ data }) => data),

  getSingleDispute: (id?: any) =>
    client.get(`/admin/disputes/${id}`).then(({ data }) => data),

  acceptDispute: (id: string) =>
    client.post(`/admin/disputes/${id}/accept`).then(({ data }) => data),

  settleDispute: ({ id, payload }: { id: string; payload: any }) =>
    client
      .post(`/admin/disputes/${id}/settle`, payload)
      .then(({ data }) => data),
};
