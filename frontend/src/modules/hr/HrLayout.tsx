import { Layout, Menu, Typography } from "antd";
import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HR_MASTER_DATA_MENU_ITEMS,
  HR_MASTER_MENU_ITEMS,
  HR_MASTER_MENU_PARENT_KEY,
} from "./master-data/shared";

const { Content, Sider } = Layout;
const { Text, Title } = Typography;

function HrLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKeys = useMemo(() => {
    const match = [...HR_MASTER_DATA_MENU_ITEMS]
      .sort((a, b) => b.key.length - a.key.length)
      .find((item) => location.pathname === item.key || location.pathname.startsWith(`${item.key}/`));

    return match ? [match.key] : [];
  }, [location.pathname]);

  const openKeys = useMemo(() => {
    if (selectedKeys.length > 0) {
      return [HR_MASTER_MENU_PARENT_KEY];
    }

    return [];
  }, [selectedKeys]);

  return (
    <Layout className="min-h-[calc(100vh-13rem)] rounded-[2rem] bg-transparent">
      <Sider
        width={280}
        breakpoint="lg"
        collapsedWidth={0}
        theme="light"
        className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white"
      >
        <div className="border-b border-slate-200 px-5 py-5">
          <Text className="block text-xs uppercase tracking-[0.3em] text-teal-700">Human Resources</Text>
          <Title level={4} className="!mb-0 !mt-2">
            Human Resources
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={[HR_MASTER_MENU_PARENT_KEY]}
          openKeys={openKeys}
          items={HR_MASTER_MENU_ITEMS.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            disabled: "disabled" in item ? item.disabled : undefined,
            children: "children" in item ? item.children.map((child) => ({
              key: child.key,
              icon: child.icon,
              label: child.label,
            })) : undefined,
          }))}
          onClick={({ key }) => navigate(key)}
          className="border-0 px-3 py-4"
        />
      </Sider>
      <Content className="pt-6 lg:pl-6 lg:pt-0">
        <Outlet />
      </Content>
    </Layout>
  );
}

export default HrLayout;
