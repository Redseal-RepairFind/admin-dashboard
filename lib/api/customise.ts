import apiClient from "./apii";

const client = apiClient();

export const customise = {
  addQuestion: (payload: any) =>
    client.post(`/admin/admin_add_question`, payload).then(({ data }) => data),

  addQuiz: (payload: any) =>
    client.post(`/admin/quizzes`, payload).then(({ data }) => data),

  getQuizzes: () => client.get(`/admin/quizzes`).then(({ data }) => data),

  addSkill: (payload: any) =>
    client.post(`/admin/skills`, payload).then(({ data }) => data),

  getSkills: () => client.get(`/admin/skills`).then(({ data }) => data),
};
