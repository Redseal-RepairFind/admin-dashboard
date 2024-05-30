import apiClient from "./apii";

const client = apiClient();

export const staff = {
  getStaff: () => client.get("/admin/staffs").then(({ data }) => data),
};
