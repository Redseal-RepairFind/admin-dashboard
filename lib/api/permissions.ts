import apiClient from "./apii";

const client = apiClient();

export const permissions = {
  getPermissions: () => client.get("admin/permission").then(({ data }) => data),
};
