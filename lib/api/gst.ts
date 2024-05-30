import apiClient from "./apii";

const client = apiClient();

export const gst = {
  getContractorDetails: () =>
    client.get("/admin/contractor/detail/pending/gst").then(({ data }) => data),
};
