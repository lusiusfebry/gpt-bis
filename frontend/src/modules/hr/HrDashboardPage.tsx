import { Card, Col, List, Row, Space, Typography } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { HR_MASTER_MENU_ITEMS, HrStatsPreview } from "./master-data/shared";

const { Paragraph, Text, Title } = Typography;

type HrDashboardMenuItem = {
  key: string;
  label: string;
  icon: ReactNode;
};

function HrDashboardPage() {
  const masterMenus: HrDashboardMenuItem[] = [...HR_MASTER_MENU_ITEMS[0].children];

  return (
    <Space direction="vertical" size={24} className="flex w-full">
      <Card className="rounded-3xl border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-2xl shadow-slate-950/10">
        <Space direction="vertical" size={16} className="w-full">
          <Text className="uppercase tracking-[0.3em] !text-teal-300">Human Resources</Text>
          <Title level={2} className="!mb-0 !text-white">
            Dashboard Modul HR
          </Title>
          <Paragraph className="!mb-0 !text-slate-300">
            Area kerja frontend untuk pengelolaan master data HR, termasuk struktur organisasi,
            pangkat, status kepegawaian, tag, dan lokasi kerja.
          </Paragraph>
          <HrStatsPreview />
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="h-full rounded-3xl shadow-panel" title="Daftar Master Data">
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
          <Card className="h-full rounded-3xl shadow-panel" title="Cakupan Implementasi">
            <Space direction="vertical" size={12}>
              <Text>CRUD master data frontend berbasis React 19, Ant Design v5, Tailwind, dan Axios.</Text>
              <Text>Hook generik dipakai untuk daftar, submit form, pagination, pencarian, dan toggle status.</Text>
              <Text>Routing HR dipisahkan ke layout tersendiri agar area modul lebih terstruktur.</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

export default HrDashboardPage;
