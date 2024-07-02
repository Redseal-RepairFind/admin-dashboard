import apiClient from "./apii";

const client = apiClient();

export const customise = {
  addQuestion: (payload: any) =>
    client.post(`/admin/admin_add_question`, payload).then(({ data }) => data),

  getQuizzes: () => client.get(`/admin/quizzes`).then(({ data }) => data),
};
