import apiClient from "./apii";

const client = apiClient();

export const permissions = {
  getPermissions: () =>
    client.get("admin/permissions").then(({ data }) => data),

  addPermission: (payload: any) =>
    client.post("admin/permissions", payload).then(({ data }) => data),
  getMyPermissions: () =>
    client.get(`admin/my-permissions`).then(({ data }) => data),
};
