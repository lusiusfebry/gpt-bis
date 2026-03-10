import { Button, Card, Space, Typography } from "antd";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import AuthLayout from "../components/layouts/AuthLayout";
import MainLayout from "../components/layouts/MainLayout";
import { useAuth } from "../modules/auth/AuthContext";
import LoginPage from "../modules/auth/LoginPage";

const { Paragraph, Text, Title } = Typography;

function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <Card className="rounded-3xl shadow-panel">
        <Space direction="vertical" size={12} className="w-full">
          <Text className="uppercase tracking-[0.28em] text-teal-700">Dashboard</Text>
          <Title level={2} className="!mb-0">
            Ringkasan operasional perusahaan
          </Title>
          <Paragraph className="!mb-0 text-base text-slate-600">
            Dashboard awal siap digunakan sebagai landing area setelah autentikasi berhasil dan dapat dikembangkan untuk modul internal berikutnya.
          </Paragraph>
        </Space>
      </Card>

      <Card className="rounded-3xl shadow-panel">
        <Space direction="vertical" size={16} className="w-full">
          <div>
            <Title level={4} className="!mb-2">
              Akses cepat
            </Title>
            <Paragraph className="!mb-0 text-slate-600">
              Gunakan navigasi utama untuk membuka modul Human Resources dan area aplikasi internal lainnya.
            </Paragraph>
          </div>
          <Button type="default">
            <Link to="/hr">Buka modul HR</Link>
          </Button>
        </Space>
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

function LoginRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginRoute />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/hr/*" element={<HrPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
