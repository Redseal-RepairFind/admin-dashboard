import apiClient from "./apii";

const client = apiClient();

export const customers = {
  getCustomers: () =>
    client
      .get("/admin/customer/detail?page=1&limit=20")
      .then(({ data }) => data),

  getCustomerDetails: ({ id }: { id: any }) =>
    client.get(`/admin/customer/detail/${id}`).then(({ data }) => data),
};
