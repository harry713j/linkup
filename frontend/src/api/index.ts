import axios from "axios";
import { config } from "@/config";

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  console.log("Access Token: ", accessToken);
}

axiosInstance.interceptors.request.use(
  function (config) {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    console.log("Failed req: ", originalRequest);

    if (
      originalRequest.url !== "/auth/register" &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh" &&
      error.response
    ) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // preventing retry loop, if already retried

        try {
          const res = await axios.get("/auth/refresh", {
            withCredentials: true,
          });
          const newAccessToken = res.data.accessToken;
          setAccessToken(newAccessToken);

          return axiosInstance(originalRequest); // retry the failed request due to expired token
        } catch (err) {
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
