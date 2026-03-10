import { Button, Card, Space, Typography } from "antd";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import MainLayout from "../components/layouts/MainLayout";

const { Paragraph, Text, Title } = Typography;

function LoginPage() {
  return (
    <Card className="w-full max-w-md rounded-3xl shadow-2xl shadow-slate-900/10">
      <Space direction="vertical" size={8} className="w-full">
        <Text className="uppercase tracking-[0.28em] text-teal-700">Portal Internal</Text>
        <Title level={3} className="!mb-1">
          Masuk ke sistem
        </Title>
        <Paragraph className="!mb-4 text-slate-600">
          Halaman login masih berupa placeholder untuk memverifikasi alur autentikasi dan tampilan dasar aplikasi.
        </Paragraph>
        <Button type="primary" size="large" block>
          Tombol Login Placeholder
        </Button>
      </Space>
    </Card>
  );
}

function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <Card className="rounded-3xl shadow-panel">
        <Space direction="vertical" size={12} className="w-full">
          <Text className="uppercase tracking-[0.28em] text-teal-700">Beranda</Text>
          <Title level={2} className="!mb-0">
            Ringkasan operasional perusahaan
          </Title>
          <Paragraph className="!mb-0 text-base text-slate-600">
            Scaffold frontend siap digunakan untuk dashboard enterprise, integrasi autentikasi, dan modul operasional berikutnya.
          </Paragraph>
        </Space>
      </Card>
      <Card className="rounded-3xl shadow-panel">
        <Title level={4}>Akses cepat</Title>
        <Paragraph className="text-slate-600">
          Gunakan navigasi di sisi kiri untuk membuka modul Human Resources dan area aplikasi lainnya.
        </Paragraph>
        <Button type="default">
          <Link to="/hr">Buka modul HR</Link>
        </Button>
      </Card>
    </div>
  );
}

function HrPage() {
  return (
    <Card className="rounded-3xl shadow-panel">
      <Space direction="vertical" size={12}>
        <Text className="uppercase tracking-[0.28em] text-teal-700">Human Resources</Text>
        <Title level={2} className="!mb-0">
          Modul HR placeholder
        </Title>
        <Paragraph className="!mb-0 text-slate-600">
          Area ini disiapkan untuk fitur data karyawan, struktur organisasi, absensi, dan proses administrasi SDM.
        </Paragraph>
      </Space>
    </Card>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/hr/*" element={<HrPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
