import apiClient from "./apii";

const client = apiClient();

export const customers = {
  getCustomers: () =>
    client
      .get("/admin/customer/detail?page=1&limit=20")
      .then(({ data }) => data),

      suspendCustomer: (payload: any) =>
        client
          .post("/admin/customer/account/status", payload)
          .then(({ data }) => data),

  getCustomerDetails: ({ id }: { id: any }) =>
    client.get(`/admin/customer/detail/${id}`).then(({ data }) => data),

  getCustomerHistory: ({ id }: { id: any }) =>
    client
      .get(`/admin/customer/job/detail/${id}?page=1&limit=50`)
      .then(({ data }) => data),
};
