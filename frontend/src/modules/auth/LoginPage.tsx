import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, App, Button, Card, Form, Input, Space, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const { Paragraph, Text, Title } = Typography;

const nikPattern = /^\d{2}-\d{5}$/;

type LoginFormValues = {
  nomor_induk_karyawan: string;
  password: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notification } = App.useApp();
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await login({
        nomor_induk_karyawan: values.nomor_induk_karyawan,
        password: values.password,
      });

      notification.success({
        message: "Autentikasi berhasil",
        description: "Anda akan diarahkan ke dashboard utama.",
        placement: "topRight",
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        isAxiosError<{ message?: string | string[] }>(error) && error.response?.data?.message
          ? Array.isArray(error.response.data.message)
            ? error.response.data.message.join(", ")
            : error.response.data.message
          : "Login gagal. Periksa kembali NIK dan password Anda.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl shadow-teal-950/10 backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500" />
      <Space direction="vertical" size={24} className="relative w-full">
        <div>
          <Text className="mb-3 block text-xs font-semibold uppercase tracking-[0.34em] text-teal-700">
            Secure Sign In
          </Text>
          <Title level={2} className="!mb-3 !text-slate-900">
            Akses portal internal perusahaan
          </Title>
          <Paragraph className="!mb-0 text-base leading-7 text-slate-600">
            Gunakan nomor induk karyawan dan password resmi untuk masuk ke sistem administrasi internal dengan aman.
          </Paragraph>
        </div>

        {errorMessage ? (
          <Alert
            type="error"
            showIcon
            message="Autentikasi gagal"
            description={errorMessage}
            className="rounded-2xl"
          />
        ) : null}

        <Form<LoginFormValues>
          layout="vertical"
          size="large"
          requiredMark={false}
          onFinish={handleSubmit}
          autoComplete="off"
          className="w-full"
        >
          <Form.Item
            label="Nomor Induk Karyawan"
            name="nomor_induk_karyawan"
            rules={[
              { required: true, message: "Nomor induk karyawan wajib diisi" },
              { pattern: nikPattern, message: "Format NIK harus 99-99999" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-slate-400" />}
              placeholder="Contoh: 12-34567"
              inputMode="numeric"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password wajib diisi" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder="Masukkan password"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={isSubmitting} className="mt-2 h-12 rounded-2xl">
            Masuk ke dashboard
          </Button>
        </Form>

        <div className="rounded-2xl border border-teal-100 bg-teal-50/80 px-4 py-3">
          <Text className="text-sm leading-6 text-teal-900">
            Pastikan Anda menggunakan kredensial resmi perusahaan. Seluruh aktivitas login tercatat untuk kepentingan keamanan sistem.
          </Text>
        </div>
      </Space>
    </Card>
  );
}

export default LoginPage;
