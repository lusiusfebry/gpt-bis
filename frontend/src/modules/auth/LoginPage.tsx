import { App, Button, Checkbox, Form, Input, Alert } from "antd";
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

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";
  const destinationAfterLogin = redirectTo === "/login" ? "/" : redirectTo;

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
        description: "Anda akan diarahkan ke welcome page.",
        placement: "topRight",
      });

      navigate(destinationAfterLogin, { replace: true });
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
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500">Please enter your credentials to access the system.</p>
      </header>

      {errorMessage ? (
        <Alert
          type="error"
          showIcon
          message="Autentikasi gagal"
          description={errorMessage}
          className="rounded-lg mb-6"
        />
      ) : null}

      <Form<LoginFormValues>
        layout="vertical"
        size="large"
        requiredMark={false}
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{ rememberMe: true }}
        className="space-y-6"
      >
        <Form.Item
          label={<span className="text-sm font-bold text-slate-700">NIK (Nomor Induk Karyawan)</span>}
          name="nomor_induk_karyawan"
          rules={[
            { required: true, message: "Nomor induk karyawan wajib diisi" },
            { pattern: nikPattern, message: "Format NIK harus 99-99999" },
          ]}
          className="mb-0"
        >
          <Input
            placeholder="XX-XXXXX"
            inputMode="numeric"
            className="w-full rounded-lg border-slate-200 bg-slate-50 py-4 px-4 text-slate-900 focus:ring-primary focus:border-primary"
            classNames={{ input: "bg-transparent border-transparent focus:bg-transparent" }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-sm font-bold text-slate-700">Password</span>}
          name="password"
          rules={[{ required: true, message: "Password wajib diisi" }]}
          className="mb-0"
        >
          <Input.Password
            placeholder="Enter your password"
            className="w-full rounded-lg border-slate-200 bg-slate-50 py-4 px-4 text-slate-900 focus:ring-primary focus:border-primary"
            classNames={{ input: "bg-transparent border-transparent focus:bg-transparent" }}
          />
        </Form.Item>

        <div className="flex items-center justify-between">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Remember me</Checkbox>
          </Form.Item>
          <a href="#" className="text-sm font-bold text-slate-900 hover:underline decoration-2 underline-offset-4">
            Forgot Password?
          </a>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isSubmitting}
          className="w-full bg-primary text-slate-900 font-black py-4 h-auto rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform active:scale-[0.98] uppercase tracking-widest text-sm border-0"
        >
          LOGIN TO SYSTEM
        </Button>
      </Form>

      <div className="mt-12 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400">support_agent</span>
          <p className="text-xs text-slate-500 leading-relaxed">
            Need technical assistance? Contact <span className="font-bold text-slate-700">IT Site Taliabu Support</span> at <span className="text-primary font-bold">ext. 404</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
