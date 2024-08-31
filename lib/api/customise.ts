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

  getSkills: () => client.get(`/admin/skills`).then(({ data }) => data),
};
