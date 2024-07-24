import apiClient from "./apii";

const client = apiClient();

export const dispute = {
  getDisputes: ({ status }: { status: string }) =>
    client
      .get(`/admin/disputes?page=1&limit=20&status=${status}`)
      .then(({ data }) => data),
};
