import apiClient from "./apii";

const client = apiClient();

export const permissions = {
  getPermissions: () =>
    client.get("admin/permissions").then(({ data }) => data),

  addPermission: (payload: any) =>
    client.post("admin/permission", payload).then(({ data }) => data),
};
