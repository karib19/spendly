
import axios from "axios";

const baseURL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate refresh request avoids running the same interceptors recursively.
let refreshPromise = null;

// Attach the access token to requests.
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("spendly_access");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh expired access tokens and retry the original request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || "";

    const isAuthEndpoint =
      url.includes("/accounts/login/") ||
      url.includes("/accounts/register/") ||
      url.includes("/accounts/token/refresh/") ||
      url.includes("/accounts/logout/");

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("spendly_refresh");

    if (!refreshToken) {
      localStorage.removeItem("spendly_access");
      window.location.assign("/login");
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/accounts/token/refresh/`, {
            refresh: refreshToken,
          })
          .then((response) => {
            const newAccessToken = response.data.access;

            if (!newAccessToken) {
              throw new Error("No access token returned.");
            }

            localStorage.setItem(
              "spendly_access",
              newAccessToken
            );

            // Save a rotated refresh token if the backend returns one.
            if (response.data.refresh) {
              localStorage.setItem(
                "spendly_refresh",
                response.data.refresh
              );
            }

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("spendly_access");
      localStorage.removeItem("spendly_refresh");

      window.location.assign("/login");

      return Promise.reject(refreshError);
    }
  }
);

export default api;
