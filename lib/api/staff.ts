import apiClient from "./apii";

const client = apiClient();

export const staff = {
  getStaff: ({ page, limit, search }: { page: any; limit: any; search: any }) =>
    client
      .get(
        `/admin/staffs?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ""
        }`
      )
      .then(({ data }) => data),

  addStaff: (payload: any) =>
    client.post("/admin/staffs", payload).then(({ data }) => data),

  updatePermission: (payload: any) =>
    client.post("/admin/staffs/permission", payload).then(({ data }) => data),

  removeStaffPermission: (payload: any) =>
    client
      .post("/admin/staffs/permission/remove", payload)
      .then(({ data }) => data),

  suspendStaff: (payload: any) =>
    client.post("/admin/staffs/status", payload).then(({ data }) => data),

  // teams
  createTeam: (payload: any) =>
    client.post("/admin/teams", payload).then(({ data }) => data),

  getTeams: () => client.get("/admin/teams").then(({ data }) => data),

  getTeamDetails: (id: any) =>
    client.get(`/admin/teams/${id}`).then(({ data }) => data),

  updateTeamDetails: ({ id, payload }: { id: string; payload: any }) =>
    client.patch(`/admin/teams/${id}`, payload).then(({ data }) => data),

  deleteTeam: (id: string) =>
    client.delete(`/admin/teams/${id}`).then(({ data }) => data),

  updateTeamPermissions: ({ id, payload }: { id: string; payload: any }) =>
    client
      .patch(`/admin/teams/${id}/permissions`, payload)
      .then(({ data }) => data),
};
