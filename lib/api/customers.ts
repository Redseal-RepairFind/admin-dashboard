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
    skills,
    filterByAdmin,
  }: {
    route:
      | "customers"
      | "contractors"
      | "disputes"
      | "jobs"
      | "emergencies"
      | "jobdays"
      | "transactions"
      | "issues";
    limit: number;
    page: number;
    criteria: string;
    search?: string;
    status?: string;
    type?: string;
    customersWithBooking?: boolean;
    accountStatus: string;
    skills?: string;
    filterByAdmin?: string;
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
        }${
          search
            ? `&searchFields=firstName,lastName,email&search=${search}`
            : ""
        }${type ? `&type=${type}` : ""}${
          status && route === "disputes"
            ? `&status=${status?.toUpperCase()}${
                status === "resolved" ? `&filterByAdmin=${filterByAdmin}` : ""
              }`
            : ""
        }${
          status && route === "transactions"
            ? `&status=${status?.toUpperCase()}`
            : ""
        }${
          status && route === "issues" ? `&status=${status?.toUpperCase()}` : ""
        }${skills && route === "contractors" ? `&skills=${skills}` : ""}`
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
    skills,
    filterByAdmin,
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
      | "issues";

    criteria: string;
    search?: string;
    status?: string;
    type?: string;
    customersWithBooking?: boolean;
    accountStatus: string;
    skills?: string;
    filterByAdmin?: string;
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
        }${
          search
            ? `&searchFields=firstName,lastName,email&search=${search}`
            : ""
        }${type ? `&type=${type}` : ""}${
          status && route === "disputes"
            ? `&status=${status?.toUpperCase()}${
                status === "resolved" ? `&filterByAdmin=${filterByAdmin}` : ""
              }`
            : ""
        }${
          status && route === "transactions"
            ? `&status=${status?.toUpperCase()}`
            : ""
        }${
          status && route === "issues" ? `&status=${status?.toUpperCase()}` : ""
        }${skills && route === "contractors" ? `&skills=${skills}` : ""}`
      )
      .then(({ data }) => data),

  getAllData: ({
    route,
  }: {
    route:
      | "customers"
      | "contractors"
      | "disputes"
      | "jobs"
      | "emergencies"
      | "jobdays"
      | "transactions"
      | "issues";
  }) =>
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
    status,
  }: {
    page: number;
    limit: number;
    startDate: string;
    endDate: string;
    criteria: string;
    status: string;
  }) =>
    client.get(
      `/admin/issues?limit=${limit}&page=${page}&status=${status?.toUpperCase()}`
    ),
  acceptIssue: (id: string) => client.post(`/admin/issues/${id}/accept`),
  getSingleIssue: (id: string) => client.get(`/admin/issues/${id}`),
  sanctionUser: ({ id, payload }: { id: string; payload: any }) =>
    client.post(`/admin/issues/${id}/sanction`, payload),
  sanctionDisputeUser: ({ id, payload }: { id: string; payload: any }) =>
    client.post(`/admin/disputes/${id}/sanction`, payload),

  // single jobs

  getSingleJob: (id: string) =>
    client.get(`/admin/jobs/${id}`).then(({ data }) => data),
};
