import { App } from "antd";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import api from "../../lib/axios";

export type AuthUser = {
  id: string;
  nomor_induk_karyawan: string;
  nama_lengkap: string;
  created_at: string;
  updated_at: string;
};

type LoginPayload = {
  nomor_induk_karyawan: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

type ProfileResponse = AuthUser;

export type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<string | null>;
  setUser: (user: AuthUser | null) => void;
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setStoredTokens(accessToken: string, refreshToken: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function clearStoredTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function getStoredRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { message } = App.useApp();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // noop
    } finally {
      clearStoredTokens();
      setUser(null);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
      clearStoredTokens();
      setUser(null);
      return null;
    }

    const { data } = await api.post<RefreshResponse>("/auth/refresh", {
      refreshToken,
    });

    setStoredTokens(data.accessToken, data.refreshToken);

    return data.accessToken;
  }, []);

  const fetchProfile = useCallback(async () => {
    const { data } = await api.get<ProfileResponse>("/auth/profile");
    setUser(data);
    return data;
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { data } = await api.post<LoginResponse>("/auth/login", payload);

      setStoredTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      message.success("Login berhasil");
    },
    [message],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = getStoredRefreshToken();

      if (!accessToken && !refreshToken) {
        setIsInitializing(false);
        return;
      }

      try {
        if (!accessToken && refreshToken) {
          await refreshAuth();
        }

        await fetchProfile();
      } catch {
        clearStoredTokens();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    void initializeAuth();
  }, [fetchProfile, refreshAuth]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      logout,
      refreshAuth,
      setUser,
    }),
    [isInitializing, login, logout, refreshAuth, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
