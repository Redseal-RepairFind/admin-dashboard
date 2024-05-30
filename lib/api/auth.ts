import apiClient from "./apii";

const client = apiClient();

export const auth = {
  login: (payload: any) =>
    client.post("/admin/signin", payload).then(({ data }) => data),

  register: (payload: any) =>
    client.post("/admin/signup", payload).then(({ data }) => data),

  forgotPassword: (payload: any) =>
    client.post("/admin/forgot/password", payload).then(({ data }) => data),

  resetPassword: (payload: any) =>
    client.post("/admin/reset/password", payload).then(({ data }) => data),

  verifyEmail: (payload: any) =>
    client.post("/admin/email/verification", payload).then(({ data }) => data),
};
