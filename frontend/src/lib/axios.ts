import Axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from "axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const api = Axios.create({
  baseURL: "/api",
});

const refreshClient = Axios.create({
  baseURL: "/api",
});

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
}

function clearAuthAndRedirect() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

function withAuthorization(config: AxiosRequestConfig, token: string) {
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    withAuthorization(config, token);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/logout")
    ) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest._retry = true;
          withAuthorization(originalRequest, token);
          return api(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshClient.post<RefreshResponse>("/auth/refresh", {
        refreshToken,
      });

      window.localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      processQueue(null, data.accessToken);
      withAuthorization(originalRequest, data.accessToken);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
