import { Card, Col, List, Row, Space, Typography } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { HR_KARYAWAN_MENU_KEY, HR_MASTER_MENU_ITEMS, HrStatsPreview } from "./master-data/shared";

const { Paragraph, Text, Title } = Typography;

type HrDashboardMenuItem = {
  key: string;
  label: string;
  icon: ReactNode;
};

function HrDashboardPage() {
  const masterMenus: HrDashboardMenuItem[] = [...HR_MASTER_MENU_ITEMS[0].children];
  const manajemenKaryawanMenu = HR_MASTER_MENU_ITEMS[1];

  return (
    <Space direction="vertical" size={24} className="flex w-full">
      <Card className="rounded-xl border border-slate-200 bg-white p-6">
        <Space direction="vertical" size={16} className="w-full">
          <Text className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Human Resources</Text>
          <Title level={2} className="!mb-0 !text-slate-900">
            Dashboard Modul HR
          </Title>
          <Paragraph className="!mb-0 !text-slate-500">
            Area kerja frontend untuk pengelolaan master data HR, termasuk struktur organisasi,
            pangkat, status kepegawaian, tag, lokasi kerja, dan manajemen karyawan.
          </Paragraph>
          <HrStatsPreview />
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="h-full rounded-xl border border-slate-200 shadow-sm" title="Daftar Master Data">
            <List<HrDashboardMenuItem>
              dataSource={masterMenus}
              renderItem={(item) => (
                <List.Item>
                  <Link to={item.key} className="flex w-full items-center justify-between gap-4">
                    <Space>
                      {item.icon}
                      <span>{item.label}</span>
                    </Space>
                    <Text type="secondary">Buka</Text>
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} className="flex w-full">
            <Card className="rounded-xl border border-slate-200 shadow-sm" title="Manajemen Karyawan">
              <Link to={HR_KARYAWAN_MENU_KEY} className="flex items-center justify-between gap-4">
                <Space>
                  {manajemenKaryawanMenu.icon}
                  <span>{manajemenKaryawanMenu.label}</span>
                </Space>
                <Text type="secondary">Buka</Text>
              </Link>
            </Card>
            <Card className="h-full rounded-xl border border-slate-200 shadow-sm" title="Cakupan Implementasi">
              <Space direction="vertical" size={12}>
                <Text>
                  CRUD master data frontend berbasis React 19, Ant Design v5, Tailwind, dan Axios.
                </Text>
                <Text>
                  Hook generik dipakai untuk daftar, submit form, pagination, pencarian, dan toggle
                  status.
                </Text>
                <Text>
                  Routing HR dipisahkan ke layout tersendiri agar area modul lebih terstruktur.
                </Text>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </Space>
  );
}

export default HrDashboardPage;
