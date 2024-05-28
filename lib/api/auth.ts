import apiClient from "./apii";

const client = apiClient();

export const auth = {
  login: (payload: any) =>
    client.post("/admin/signin", payload).then(({ data }) => data),

  forgotPassword: (payload: any) =>
    client.post("/admin/forgot/password", payload).then(({ data }) => data),
};
