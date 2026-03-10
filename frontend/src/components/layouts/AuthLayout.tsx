import { Typography } from "antd";
import { Outlet } from "react-router-dom";

const { Paragraph, Title } = Typography;

function AuthLayout() {
  return (
    <main className="enterprise-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-teal-700">
            Enterprise Portal
          </p>
          <Title level={1} className="!mb-3 !text-4xl !font-semibold !text-slate-900">
            Bebang Sistem Informasi
          </Title>
          <Paragraph className="!mb-0 text-base text-slate-600">
            Platform operasional terintegrasi untuk mendukung administrasi internal perusahaan secara aman dan efisien.
          </Paragraph>
        </div>
        <Outlet />
      </section>
    </main>
  );
}

export default AuthLayout;
