import apiClient from "./apii";

const client = apiClient();

export const permissions = {
  getPermissions: (limit: number, page: number) =>
    client
      .get(`admin/permissions?limit=${limit}&page=${page}`)
      .then(({ data }) => data),

  addPermission: (payload: any) =>
    client.post("admin/permissions", payload).then(({ data }) => data),
  getMyPermissions: (limit: number, page: number) =>
    client
      .get(`admin/my-permissions?limit=${limit}&page=${page}`)
      .then(({ data }) => data),
};
