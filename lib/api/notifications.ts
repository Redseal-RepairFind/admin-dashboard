import apiClient from "./apii";

const client = apiClient();

export const notifications = {
  getNotifications: () =>
    client
      .get(`/admin/notifications?page=1&limit=1000`)
      .then(({ data }) => data),

  getNotificationAlerts: () =>
    client.get(`/admin/notifications/alerts`).then(({ data }) => data),

  markAllAsRead: () =>
    client.post(`/admin/notifications/mark-all-read`).then(({ data }) => data),
};
