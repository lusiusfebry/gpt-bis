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
import api, {
  clearAuthStorage,
  getStoredAccessToken,
  getStoredRefreshToken,
  setAuthTokens,
} from "../../lib/axios";

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
  rememberMe: boolean;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      clearAuthStorage();
      setUser(null);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
      clearAuthStorage();
      setUser(null);
      return null;
    }

    const { data } = await api.post<RefreshResponse>("/auth/refresh", {
      refreshToken,
    });

    setAuthTokens(data.accessToken, data.refreshToken, Boolean(window.localStorage.getItem("auth_storage") !== "session"));

    return data.accessToken;
  }, []);

  const fetchProfile = useCallback(async () => {
    const { data } = await api.get<ProfileResponse>("/auth/profile");
    setUser(data);
    return data;
  }, []);

  const login = useCallback(
    async ({ rememberMe, ...credentials }: LoginPayload) => {
      const { data } = await api.post<LoginResponse>("/auth/login", credentials);

      setAuthTokens(data.accessToken, data.refreshToken, rememberMe);
      setUser(data.user);
      message.success("Login berhasil");
    },
    [message],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getStoredAccessToken();
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
        clearAuthStorage();
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
