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
    client.get(`/admin/customers/${id}`).then(({ data }) => data),

  getCustomerHistory: ({ id }: { id: any }) =>
    client
      .get(`/admin/customer/job/detail/${id}?page=1&limit=50`)
      .then(({ data }) => data),

  getAnalytics: ({
    route,
    limit,
    page,
    criteria,
    search,
    status,
    type,
    customersWithBooking,
    accountStatus,
  }: {
    route:
      | "customers"
      | "contractors"
      | "disputes"
      | "jobs"
      | "emergencies"
      | "jobdays"
      | "transactions"
      | "";
    limit: number;
    page: number;
    criteria: string;
    search?: string;
    status?: string;
    type?: string;
    customersWithBooking?: boolean;
    accountStatus: string;
  }) =>
    route &&
    client
      .get(
        `/admin/${route}?limit=${limit}&page=${page}${
          criteria ? `&sort=${criteria}` : ""
        }${
          accountStatus ? `&accountStatus=${accountStatus.toUpperCase()}` : ""
        }${
          customersWithBooking
            ? `&customersWithBooking=${customersWithBooking}`
            : ""
        }${search ? `&searchFields=firstName,lastName&search=${search}` : ""}${
          type ? `&type=${type}` : ""
        }${
          status && route === "disputes"
            ? `&status=${status?.toUpperCase()}`
            : ""
        }${
          status && route === "transactions"
            ? `&status=${status?.toUpperCase()}`
            : ""
        }`
      )
      .then(({ data }) => data),

  getSortingAnalytics: ({
    page,
    limit,
    startDate,
    endDate,
    route,
    criteria,
    search,
    status,
    type,
    customersWithBooking,
    accountStatus,
  }: {
    page: number;
    limit: number;
    startDate: string;
    endDate: string;
    route:
      | "customers"
      | "contractors"
      | "disputes"
      | "jobs"
      | "emergencies"
      | "jobdays"
      | "transactions"
      | "";

    criteria: string;
    search?: string;
    status?: string;
    type?: string;
    customersWithBooking?: boolean;
    accountStatus: string;
  }) =>
    route &&
    client
      .get(
        `/admin/${route}?limit=${limit}&page=${page}&startDate=${startDate}&endDate=${endDate}${
          criteria ? `&sort=${criteria}` : ""
        }${
          accountStatus ? `&accountStatus=${accountStatus.toUpperCase()}` : ""
        }${
          customersWithBooking
            ? `&customersWithBooking=${customersWithBooking}`
            : ""
        }${search ? `&searchFields=firstName,lastName&search=${search}` : ""}${
          type ? `&type=${type}` : ""
        }${
          status && route === "disputes"
            ? `&status=${status?.toUpperCase()}`
            : ""
        }${
          status && route === "transactions"
            ? `&status=${status?.toUpperCase()}`
            : ""
        }`
      )
      .then(({ data }) => data),

  getAllData: ({ route }: { route: string }) =>
    route &&
    client.get(`/admin/${route}?limit=1000000000`).then(({ data }) => data),

  getSearchSort: ({
    page,
    limit,
    criteria,
    route,
  }: {
    page: number;
    limit: number;
    criteria: string;
    route: "customers" | "contractors" | "disputes" | "jobs" | "emergencies";
  }) =>
    client
      .get(`/admin/${route}?limit=${limit}&page=${page}`)
      .then(({ data }) => data),
  gettIssues: ({
    page,
    limit,
    startDate,
    endDate,
    criteria,
  }: {
    page: number;
    limit: number;
    startDate: string;
    endDate: string;
    criteria: string;
  }) => client.get(`/admin/issues?limit=${limit}&page=${page}`),
  acceptIssue: (id: string) => client.post(`/admin/issues/${id}/accept`),
  getSingleIssue: (id: string) => client.get(`/admin/issues/${id}`),
  sanctionUser: ({ id, payload }: { id: string; payload: any }) =>
    client.post(`/admin/issues/${id}/sanction`, payload),
  sanctionDisputeUser: ({ id, payload }: { id: string; payload: any }) =>
    client.post(`/admin/disputes/${id}/sanction`, payload),
};
