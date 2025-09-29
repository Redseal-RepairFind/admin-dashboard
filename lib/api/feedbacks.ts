import apiClient from "./apii";

const client = apiClient();

export const feedbacks = {
  getFeedbacks: () => client.get(`/admin/feedbacks`).then(({ data }) => data),
  getFeedbackDetails: (id: string) =>
    client.get(`/admin/feedbacks/${id}`).then(({ data }) => data),
  acceptFeedback: (id: string) =>
    client.patch(`/admin/feedbacks/${id}/assign`).then(({ data }) => data),
  replyFeedback: ({
    id,
    payload,
  }: {
    id: string;
    payload: {
      message: string;
    };
  }) =>
    client
      .patch(`/admin/feedbacks/${id}/reply`, payload)
      .then(({ data }) => data),
};
