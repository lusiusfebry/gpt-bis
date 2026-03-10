import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Space, Typography } from "antd";
import { useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const { Content, Footer, Header, Sider } = Layout;
const { Paragraph, Text, Title } = Typography;

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKeys = useMemo(() => {
    if (location.pathname.startsWith("/hr")) {
      return ["/hr"];
    }

    return ["/"];
  }, [location.pathname]);

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
              <Text className="block text-xs uppercase tracking-[0.3em] text-teal-700">
                Portal Perusahaan
              </Text>
              <Title level={4} className="!mb-0">
                Bebang Sistem Informasi
              </Title>
            </div>
          </Space>
          <Paragraph className="!mb-0 hidden text-right text-slate-500 md:block">
            Antarmuka enterprise siap untuk pengembangan modul operasional dan SDM.
          </Paragraph>
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
