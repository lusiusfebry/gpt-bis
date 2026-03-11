import {
  BellOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Layout, Spin, Typography } from "antd";
import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useModules, type ModuleItem } from "../../modules/app/useModules";
import { useAuth } from "../../modules/auth/AuthContext";

const { Content, Footer, Header } = Layout;
const { Text } = Typography;

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
    <Layout className="min-h-screen bg-background-light text-slate-900">
      <Header className="sticky top-0 z-20 !h-auto border-b border-slate-200 bg-white px-4 py-3 !leading-normal sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4 lg:gap-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex min-w-0 items-center gap-3 rounded-xl border-0 bg-transparent p-0 text-left shadow-none transition-opacity hover:opacity-90"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-base font-bold text-slate-900 shadow-sm shadow-primary/20">
                PT
              </div>
              <Text className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                PT Prima Sarana Gemilang
              </Text>
            </button>

            <div className="hidden min-w-0 items-center gap-6 xl:flex">
              {isLoading ? (
                <div className="flex h-10 items-center px-1">
                  <Spin size="small" />
                </div>
              ) : (
                activeModules.map((module: ModuleItem) => {
                  const isActive = selectedKeys.includes(module.path);

                  return (
                    <button
                      key={module.path}
                      type="button"
                      onClick={() => navigate(module.path)}
                      className={`inline-flex h-10 items-center border-b-2 px-0 text-sm transition-colors ${
                        isActive
                          ? "border-primary font-bold text-primary"
                          : "border-transparent font-semibold text-slate-500 hover:text-primary"
                      }`}
                    >
                      <span className="max-w-[12rem] truncate">{module.nama}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3 lg:gap-4">
            <Input
              allowClear
              placeholder="Cari modul atau halaman"
              prefix={<SearchOutlined className="text-slate-400" />}
              className="hidden !h-10 !w-[240px] !rounded-lg !border-none !bg-slate-100 md:!inline-flex"
            />

            <Button
              type="default"
              shape="circle"
              icon={<BellOutlined />}
              className="!flex !h-10 !w-10 !items-center !justify-center !border-none !bg-slate-100 !text-slate-600 shadow-none hover:!bg-slate-200 hover:!text-slate-900"
              aria-label="Notifikasi"
            />

            <div className="flex min-w-0 items-center gap-3 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-2 sm:pl-2.5 sm:pr-3">
              <Avatar className="h-9 w-9 shrink-0 border border-primary/30 bg-primary/20 !text-sm !font-bold !leading-9 !text-slate-900">
                {initials}
              </Avatar>
              <div className="hidden min-w-0 leading-tight sm:block">
                <Text className="block truncate text-sm font-semibold text-slate-900">
                  {user?.nama_lengkap ?? "-"}
                </Text>
                <Text className="block truncate text-xs font-medium text-slate-500">
                  NIK {user?.nomor_induk_karyawan ?? "-"}
                </Text>
              </div>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={() => void handleLogout()}
                className="!flex !h-9 !items-center !justify-center !rounded-full !px-3 !font-semibold !text-slate-700 hover:!bg-white hover:!text-slate-900"
              >
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </Header>

      <div className="border-b border-slate-200 bg-white px-4 py-3 xl:hidden sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex h-10 items-center justify-center">
            <Spin size="small" />
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-1">
            {activeModules.map((module: ModuleItem) => {
              const isActive = selectedKeys.includes(module.path);

              return (
                <button
                  key={module.path}
                  type="button"
                  onClick={() => navigate(module.path)}
                  className={`inline-flex h-9 shrink-0 items-center border-b-2 px-0 text-sm transition-colors ${
                    isActive
                      ? "border-primary font-bold text-primary"
                      : "border-transparent font-semibold text-slate-500 hover:text-primary"
                  }`}
                >
                  <span>{module.nama}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Content className="flex-1 bg-background-light px-4 py-6 sm:px-6 lg:px-8">
        <div className="min-h-[calc(100vh-13rem)]">
          <Outlet />
        </div>
      </Content>

      <Footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Text className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            © 2024 PT Prima Sarana Gemilang - Internal Systems
          </Text>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="#"
              className="text-xs font-bold text-slate-400 transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs font-bold text-slate-400 transition-colors hover:text-primary"
            >
              Support Center
            </a>
            <a
              href="#"
              className="text-xs font-bold text-slate-400 transition-colors hover:text-primary"
            >
              System v4.2.0
            </a>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}

export default MainLayout;
