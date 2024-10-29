import apiClient from "./apii";

const client = apiClient();

const URL = "/admin/promotions";

export const promotions = {
  async getPromo() {
    return client.get(URL).then(({ data }) => data);
  },
  async createPromo(payload: any) {
    return client.post(URL, payload).then(({ data }) => data);
  },
  async updatePromo(id: string, payload: any) {
    return client.patch(`${URL}/${id}`, payload).then(({ data }) => data);
  },
  async deletePromo(id: any) {
    return client.delete(`${URL}/${id}`).then(({ data }) => data);
  },
};
