import {
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Space, Typography } from "antd";
import { useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../modules/auth/AuthContext";

const { Content, Footer, Header, Sider } = Layout;
const { Text, Title } = Typography;

function getUserInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const selectedKeys = useMemo(() => {
    if (location.pathname.startsWith("/hr")) {
      return ["/hr"];
    }

    return ["/"];
  }, [location.pathname]);

  const initials = useMemo(() => getUserInitials(user?.nama_lengkap ?? "User"), [user?.nama_lengkap]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Layout className="enterprise-shell min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={260}
        theme="dark"
        className="shadow-2xl shadow-slate-950/20"
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-800 px-5 py-6">
            <Text className="block text-xs uppercase tracking-[0.3em] text-teal-300">Bebang</Text>
            <Title level={4} className="!mb-0 !mt-2 !text-white">
              Sistem Informasi
            </Title>
          </div>
          <div className="flex-1 px-3 py-4">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectedKeys}
              onClick={({ key }) => navigate(key)}
              items={[
                {
                  key: "/",
                  icon: <DashboardOutlined />,
                  label: <Link to="/">Beranda</Link>,
                },
                {
                  key: "/hr",
                  icon: <TeamOutlined />,
                  label: <Link to="/hr">Human Resources</Link>,
                },
              ]}
            />
          </div>
        </div>
      </Sider>
      <Layout>
        <Header className="mx-4 mt-4 flex h-auto items-center justify-between rounded-3xl border border-white/70 px-4 py-4 shadow-panel sm:px-6">
          <Space size={16} align="center">
            <Button
              type="text"
              size="large"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((value) => !value)}
            />
            <div>
              <Text className="block text-xs uppercase tracking-[0.3em] text-teal-700">Portal Perusahaan</Text>
              <Title level={4} className="!mb-0">
                Bebang Sistem Informasi
              </Title>
            </div>
          </Space>
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <Text className="block text-xs uppercase tracking-[0.3em] text-slate-400">Pengguna Aktif</Text>
              <Text strong className="block text-sm text-slate-700">
                {user?.nama_lengkap ?? "-"}
              </Text>
              <Text className="text-xs text-slate-500">NIK {user?.nomor_induk_karyawan ?? "-"}</Text>
            </div>
            <Avatar className="bg-teal-100 !font-semibold !text-teal-700">{initials}</Avatar>
            <Button type="default" icon={<LogoutOutlined />} onClick={() => void handleLogout()}>
              Logout
            </Button>
          </div>
        </Header>
        <Content className="p-4 sm:p-6">
          <div className="min-h-[calc(100vh-13rem)] rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-panel sm:p-6">
            <Outlet />
          </div>
        </Content>
        <Footer className="px-6 pb-6 pt-0 text-center text-slate-500">
          © 2024 PT Prima Sarana Gemilang — Bebang Sistem Informasi
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
