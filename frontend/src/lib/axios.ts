/// <reference types="vite/client" />

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

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const AUTH_STORAGE_KEY = "auth_storage";
export const PERSISTENT_AUTH_STORAGE = "local";
export const SESSION_AUTH_STORAGE = "session";
const DEFAULT_BACKEND_ORIGIN = "http://localhost:3000";
const API_BASE_PATH = "/api";
const BACKEND_ORIGIN = (import.meta.env.VITE_BACKEND_ORIGIN as string | undefined)?.trim();

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getAuthStorageType() {
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === SESSION_AUTH_STORAGE
    ? SESSION_AUTH_STORAGE
    : PERSISTENT_AUTH_STORAGE;
}

function getTokenStorage(storageType = getAuthStorageType()) {
  return storageType === SESSION_AUTH_STORAGE ? window.sessionStorage : window.localStorage;
}

export function setAuthTokens(accessToken: string, refreshToken: string, rememberMe: boolean) {
  const storageType = rememberMe ? PERSISTENT_AUTH_STORAGE : SESSION_AUTH_STORAGE;
  const storage = getTokenStorage(storageType);
  const alternateStorage = storageType === SESSION_AUTH_STORAGE ? window.localStorage : window.sessionStorage;

  alternateStorage.removeItem(ACCESS_TOKEN_KEY);
  alternateStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.setItem(AUTH_STORAGE_KEY, storageType);
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthStorage() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getStoredAccessToken() {
  return getTokenStorage().getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return getTokenStorage().getItem(REFRESH_TOKEN_KEY);
}

export function getBackendOrigin() {
  if (BACKEND_ORIGIN) {
    return trimTrailingSlash(BACKEND_ORIGIN);
  }

  if (typeof window === "undefined") {
    return DEFAULT_BACKEND_ORIGIN;
  }

  return import.meta.env.DEV ? DEFAULT_BACKEND_ORIGIN : window.location.origin;
}

export function getApiBaseUrl() {
  return `${getBackendOrigin()}${API_BASE_PATH}`;
}

export function getBackendBaseUrl() {
  return getBackendOrigin();
}

const api = Axios.create({
  baseURL: getApiBaseUrl(),
});

const refreshClient = Axios.create({
  baseURL: getApiBaseUrl(),
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
  clearAuthStorage();

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
  const token = getStoredAccessToken();

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

    const refreshToken = getStoredRefreshToken();

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

      setAuthTokens(data.accessToken, data.refreshToken, getAuthStorageType() === PERSISTENT_AUTH_STORAGE);
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
