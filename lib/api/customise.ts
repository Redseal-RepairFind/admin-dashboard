import apiClient from "./apii";

const client = apiClient();

export const customise = {
  addQuestion: ({ id, payload }: { id: string; payload: any }) =>
    client
      .post(`/admin/quizzes/${id}/add-question`, payload)
      .then(({ data }) => data),

  updateQuestion: ({ id, payload }: { id: string; payload: any }) =>
    client.patch(`/admin/questions/${id}`, payload).then(({ data }) => data),

  deleteQuestion: (id: string) =>
    client.delete(`/admin/questions/${id}`).then(({ data }) => data),

  addQuiz: (payload: any) =>
    client.post(`/admin/quizzes`, payload).then(({ data }) => data),

  getQuizzes: () => client.get(`/admin/quizzes`).then(({ data }) => data),

  addSkill: (payload: any) =>
    client.post(`/admin/skills`, payload).then(({ data }) => data),
  addSkills: (payload: any) =>
    client.post(`/admin/skills/bulk`, payload).then(({ data }) => data),

  getSkills: () => client.get(`/admin/skills`).then(({ data }) => data),
  deleteSkills: (skillId: string) =>
    client.delete(`/admin/skills/${skillId}`).then(({ data }) => data),
  async editSkills(skillId: string, payload: any) {
    return client
      .patch(`/admin/skills/${skillId}`, payload)
      .then(({ data }) => data);
  },

  // FAQS

  getFAQs: ({ page, limit }: { page: Number; limit: Number }) =>
    client
      .get(`/admin/faqs?page=${page}&limit=${limit}`)
      .then(({ data }) => data),
  getSingleFaq: (id: string) =>
    client.get(`/admin/faqs/${id}`).then(({ data }) => data),
  createFAQ: (payload: any) =>
    client.post(`/admin/faqs`, payload).then(({ data }) => data),
  updateFAQ: ({ id, payload }: { id: string; payload: any }) =>
    client.patch(`/admin/faqs/${id}`, payload).then(({ data }) => data),
  deleteFAQ: (id: string) =>
    client.delete(`/admin/faqs/${id}`).then(({ data }) => data),

  // TIPS

  getTips: ({ page, limit }: { page: Number; limit: Number }) =>
    client
      .get(`/admin/tips?page=${page}&limit=${limit}`)
      .then(({ data }) => data),
  getSingleTip: (id: string) =>
    client.get(`/admin/tips/${id}`).then(({ data }) => data),
  createTIP: (payload: any) =>
    client.post(`/admin/tips`, payload).then(({ data }) => data),
  updateTIP: ({ id, payload }: { id: string; payload: any }) =>
    client.patch(`/admin/tips/${id}`, payload).then(({ data }) => data),
  deleteTIP: (id: string) =>
    client.delete(`/admin/tips/${id}`).then(({ data }) => data),
};
