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

  addStaffPermission: (payload: any) =>
    client.post("/admin/staffs/permission", payload).then(({ data }) => data),

  removeStaffPermission: (payload: any) =>
    client
      .post("/admin/staffs/permission/remove", payload)
      .then(({ data }) => data),

  suspendStaff: (payload: any) =>
    client.post("/admin/staffs/status", payload).then(({ data }) => data),
};
