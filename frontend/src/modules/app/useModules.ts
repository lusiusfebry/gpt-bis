import {
  BankOutlined,
  HomeOutlined,
  InboxOutlined,
  SafetyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { App } from "antd";
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type PropsWithChildren,
} from "react";
import { useLocation } from "react-router-dom";
import api from "../../lib/axios";
import { useAuth } from "../auth/AuthContext";

export type ModuleItem = {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  ikon: string;
  path: string;
  is_aktif: boolean;
  urutan: number;
};

type ModulesContextValue = {
  modules: ModuleItem[];
  activeModules: ModuleItem[];
  isLoading: boolean;
};

export type ModuleIconComponent = ComponentType;

const moduleIconMap: Record<string, ModuleIconComponent> = {
  TeamOutlined,
  InboxOutlined,
  HomeOutlined,
  BankOutlined,
  SafetyOutlined,
};

const ModulesContext = createContext<ModulesContextValue | null>(null);

export function getModuleIcon(iconName: string): ModuleIconComponent {
  return moduleIconMap[iconName] ?? InboxOutlined;
}

export function ModulesProvider({ children }: PropsWithChildren) {
  const { message } = App.useApp();
  const location = useLocation();
  const { isAuthenticated, isInitializing } = useAuth();
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isInitializing) {
      setIsLoading(true);
      return;
    }

    if (!isAuthenticated) {
      setModules([]);
      setIsLoading(false);
      return;
    }

    const fetchModules = async () => {
      setIsLoading(true);

      try {
        const { data } = await api.get<ModuleItem[]>("/modules");
        setModules(data);
      } catch {
        if (location.pathname !== "/login") {
          message.error("Gagal memuat daftar modul");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchModules();
  }, [isAuthenticated, isInitializing, location.pathname, message]);

  const value = useMemo<ModulesContextValue>(() => {
    const sortedModules = [...modules].sort((a, b) => a.urutan - b.urutan);

    return {
      modules: sortedModules,
      activeModules: sortedModules.filter((module) => module.is_aktif),
      isLoading,
    };
  }, [isLoading, modules]);

  return createElement(ModulesContext.Provider, { value }, children);
}

export function useModules() {
  const context = useContext(ModulesContext);

  if (!context) {
    throw new Error("useModules harus digunakan di dalam ModulesProvider");
  }

  return context;
}
