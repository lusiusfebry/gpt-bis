import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Spin } from "antd";
import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useModules, type ModuleItem } from "../../modules/app/useModules";
import { useAuth } from "../../modules/auth/AuthContext";

function getUserInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeModules, isLoading } = useModules();

  const selectedKeys = useMemo(() => {
    if (location.pathname === "/" || location.pathname === "/welcome") {
      return [];
    }

    const activeModule = activeModules.find((module: ModuleItem) =>
      location.pathname.startsWith(module.path),
    );

    return activeModule ? [activeModule.path] : [];
  }, [activeModules, location.pathname]);

  const initials = useMemo(
    () => getUserInitials(user?.nama_lengkap ?? "User"),
    [user?.nama_lengkap],
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-background-light text-slate-900">
      {/* Top Navigation Bar */}
      <header className="glass-header sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex cursor-pointer items-center gap-4 transition-transform hover:scale-[1.02]" onClick={() => navigate("/")}>
          <div className="flex items-center justify-center text-primary drop-shadow-sm">
            <span className="material-symbols-outlined text-4xl">manufacturing</span>
          </div>
          <div className="flex min-w-0 flex-col items-start text-left">
            <h2 className="text-left text-xl font-black leading-tight tracking-tight text-slate-900">
              PT Prima Sarana Gemilang
            </h2>
            <span className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Site Taliabu
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="mr-8 hidden items-center gap-8 md:flex">
            {isLoading ? (
              <Spin size="small" />
            ) : (
              activeModules.map((module: ModuleItem) => {
                const isActive = selectedKeys.includes(module.path);

                return (
                  <button
                    key={module.path}
                    type="button"
                    onClick={() => navigate(module.path)}
                    className={`relative text-xs font-black uppercase tracking-widest transition-all hover:text-primary ${isActive ? "text-primary px-2" : "text-slate-500"
                      }`}
                  >
                    {module.nama}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-primary shadow-[0_0_8px_rgba(242,196,13,0.5)]"></span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-100/50 p-1.5 backdrop-blur-sm border border-slate-200/50">
            <button className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-white hover:text-primary hover:shadow-sm">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-white hover:text-primary hover:shadow-sm">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
            <div className="mx-1 h-4 w-px bg-slate-200"></div>
            <button
              onClick={() => void handleLogout()}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
              title="Logout"
            >
              <LogoutOutlined />
            </button>
          </div>

          <Avatar 
            className="h-10 w-10 shrink-0 border-2 border-white bg-slate-900 text-sm font-black text-white shadow-md active:scale-95 transition-transform"
            style={{ boxShadow: '0 0 0 2px var(--color-primary), var(--shadow-md)' }}
          >
            {initials}
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      {/* Global Footer */}
      <footer className="flex flex-col items-center justify-between gap-4 bg-background-dark px-10 py-6 text-slate-400 md:flex-row mt-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-primary">shield</span>
          <span className="text-xs font-medium tracking-tight">
            PT Prima Sarana Gemilang © 2024. All Rights Reserved.
          </span>
        </div>
        <div className="flex gap-6 text-xs font-semibold">
          <a href="#" className="transition-colors hover:text-primary">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-primary">Site Protocol</a>
          <a href="#" className="transition-colors hover:text-primary">Emergency Contacts</a>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
