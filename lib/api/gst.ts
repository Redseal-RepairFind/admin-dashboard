import apiClient from "./apii";

const client = apiClient();

export const gst = {
  getContractorDetails: ({ type }: { type: any }) =>
    client.get(`/admin/contractor/detail/${type}/gst`).then(({ data }) => data),

  changeStatus: (payload: any) =>
    client
      .post(`/admin/validate/contractor/gst`, payload)
      .then(({ data }) => data),
};
