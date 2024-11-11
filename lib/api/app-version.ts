import apiClient from "./apii";

const client = apiClient();

const baseURL = "admin/app-versions";
export const versionControl = {
  getVersions: () => client.get(baseURL).then(({ data }) => data),
  getVersionById: (id: string) =>
    client.get(`${baseURL}/${id}`).then(({ data }) => data),
  createVersion: (payload: any) =>
    client.post(baseURL, payload).then(({ data }) => data),
  editVersion: ({ payload, id }: { payload: any; id: string }) =>
    client.patch(`${baseURL}/${id}`, payload).then(({ data }) => data),
  deleteVersion: (id: string) =>
    client.delete(`${baseURL}/${id}`).then(({ data }) => data),
};
