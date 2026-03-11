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
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-white px-6 py-4 md:px-10">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">manufacturing</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900">
              PT Prima Sarana Gemilang
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Site Taliabu
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="mr-6 hidden items-center gap-6 md:flex">
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
                    className={`text-sm font-semibold transition-colors ${isActive ? "text-primary border-b-2 border-primary pb-1" : "text-slate-600 hover:text-primary"
                      }`}
                  >
                    {module.nama}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-primary/20">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-primary/20">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button
              onClick={() => void handleLogout()}
              className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-red-100 hover:text-red-600"
              title="Logout"
            >
              <LogoutOutlined />
            </button>
          </div>

          <Avatar className="h-10 w-10 shrink-0 border-2 border-primary bg-slate-900 text-sm font-black text-white">
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
