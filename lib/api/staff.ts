import apiClient from "./apii";

const client = apiClient();

export const staff = {
  getStaff: () => client.get("/admin/staffs").then(({ data }) => data),

  addStaff: (payload: any) =>
    client.post("/admin/staff", payload).then(({ data }) => data),

  addStaffPermission: (payload: any) =>
    client.post("/admin/staff/permission", payload).then(({ data }) => data),

  removeStaffPermission: (payload: any) =>
    client
      .post("/admin/staff/permission/remove", payload)
      .then(({ data }) => data),

  suspendStaff: (payload: any) =>
    client.post("/admin/staff/status", payload).then(({ data }) => data),
};
