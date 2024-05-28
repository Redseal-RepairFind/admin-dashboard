import axios from "axios";
import { url } from "../../url";

const apiClient = () => {
  const client = axios.create({
    baseURL: url,
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  client.interceptors.request.use(
    async (config) => {
      const token = sessionStorage.getItem("userToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && error.config?.url !== "/") {
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export default apiClient;
