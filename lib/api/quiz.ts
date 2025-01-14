import axios from "axios";
import apiClient from "./apii";

const client = apiClient();

export const quiz = {
  getVideos: () => client.get(`/admin/quizzes`).then(({ data }) => data),
  getQuestions: () => client.get(`/admin/questions`).then(({ data }) => data),
  getQuiz: (session: string) =>
    client
      .get(`/common/trainings/get-quiz?session=${session}`)
      .then(({ data }) => data),
};

export async function getQuiz(session: string) {
  try {
    const response = await axios.get(
      `/common/trainings/get-quiz?session=${session}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
