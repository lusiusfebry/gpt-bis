import { CustomerServiceOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, App, Button, Checkbox, Form, Input } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const nikPattern = /^\d{2}-\d{5}$/;

type LoginFormValues = {
  nomor_induk_karyawan: string;
  password: string;
  rememberMe: boolean;
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
        rememberMe: values.rememberMe,
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
    <div>
      <div className="mb-10">
        <h2 className="mb-2 text-3xl font-black text-slate-900">Welcome Back</h2>
        <p className="text-slate-500">Please enter your credentials to access the system.</p>
      </div>

      {errorMessage ? (
        <Alert
          type="error"
          showIcon
          message="Autentikasi gagal"
          description={errorMessage}
          className="rounded-lg"
        />
      ) : null}

      <Form<LoginFormValues>
        layout="vertical"
        size="large"
        requiredMark={false}
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{ rememberMe: true }}
        className="w-full"
      >
        <Form.Item
          label="NIK (Nomor Induk Karyawan)"
          name="nomor_induk_karyawan"
          rules={[
            { required: true, message: "Nomor induk karyawan wajib diisi" },
            { pattern: nikPattern, message: "Format NIK harus 99-99999" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-slate-400" />}
            placeholder="XX-XXXXX"
            inputMode="numeric"
            className="rounded-lg border-slate-200 bg-slate-50 px-4 py-4 focus:border-primary focus:ring-primary"
          />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password wajib diisi" }]}>
          <Input.Password
            prefix={<LockOutlined className="text-slate-400" />}
            placeholder="Enter your password"
            className="rounded-lg border-slate-200 bg-slate-50 px-4 py-4 focus:border-primary focus:ring-primary"
          />
        </Form.Item>

        <div className="mb-4 flex items-center justify-between gap-4">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <span
            aria-disabled="true"
            className="cursor-not-allowed text-sm font-bold text-slate-400 decoration-2 underline-offset-4"
          >
            Forgot Password?
          </span>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isSubmitting}
          className="mt-2 h-14 rounded-lg text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20"
        >
          LOGIN TO SYSTEM
        </Button>
      </Form>

      <div className="mt-12 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <CustomerServiceOutlined className="text-base text-primary" />
          <span>Need technical assistance? Contact IT Site Taliabu Support at ext. 404</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
