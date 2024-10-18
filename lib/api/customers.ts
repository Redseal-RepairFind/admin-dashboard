import apiClient from "./apii";

const client = apiClient();

type RouteType = {
  route: "customers" | "contractors" | "disputes" | "jobs" | "job-emegercy";
};

export const customers = {
  getCustomers: ({
    page,
    limit,
    search,
  }: {
    page: any;
    limit: any;
    search: any;
  }) =>
    client
      .get(
        `/admin/customer/detail?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ""
        }`
      )
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

  getAnalytics: (
    route: "customers" | "contractors" | "disputes" | "jobs" | "emergencies"
  ) => client.get(`/admin/${route}`).then(({ data }) => data),

  getSortingAnalytics: ({
    page,
    limit,
    startDate,
    endDate,
    route,
  }: {
    page: number;
    limit: number;
    startDate: string;
    endDate: string;
    route: "customers" | "contractors" | "disputes" | "jobs" | "emergencies";
  }) =>
    client
      .get(
        `/admin/${route}?limit=${limit}&page=${page}&startDate=${startDate}&endDate=${endDate}`
      )
      .then(({ data }) => data),
};
