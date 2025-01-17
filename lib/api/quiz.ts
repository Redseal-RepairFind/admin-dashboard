import axios from "axios";
import apiClient from "./apii";

const client = apiClient();

const baseUrl = "/common/trainings";

export const quiz = {
  getVideos: () => client.get(`/admin/quizzes`).then(({ data }) => data),
  getQuestions: () => client.get(`/admin/questions`).then(({ data }) => data),
  getQuiz: (session: string) =>
    client
      .get(`${baseUrl}/get-quiz?session=${session}`)
      .then(({ data }) => data),
  submitQuiz: ({ session, answers }: { session: string; answers: any }) =>
    client
      .post(`${baseUrl}/submit-quiz?session=${session}`, answers)
      .then(({ data }) => data),
};

export async function getQuiz(session: string) {
  try {
    const response = await axios.get(`${baseUrl}/get-quiz?session=${session}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
