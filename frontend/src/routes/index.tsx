import { Card, Space, Typography } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import AuthLayout from "../components/layouts/AuthLayout";
import MainLayout from "../components/layouts/MainLayout";
import { useAuth } from "../modules/auth/AuthContext";
import LoginPage from "../modules/auth/LoginPage";
import WelcomePage from "../modules/welcome/WelcomePage";

const { Paragraph, Text, Title } = Typography;

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
          <Route path="/" element={<WelcomePage />} />
          <Route path="/hr/*" element={<HrPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
