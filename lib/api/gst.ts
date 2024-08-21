import apiClient from "./apii";

const client = apiClient();

export const gst = {
  getContractorDetails: ({ type }: { type: any }) =>
    client
      .get(`/admin/contractors?gstStatus=${type}&limit=5&page=1`)
      .then(({ data }) => data),

  changeStatus: ({ id, payload }: { id: string; payload: any }) =>
    client
      .post(`/admin/contractors/${id}/gst`, payload)
      .then(({ data }) => data),
};
