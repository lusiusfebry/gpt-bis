import { Badge, Card, Spin, Tag, Typography } from "antd";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { getModuleIcon, useModules } from "../app/useModules";

const { Paragraph, Title } = Typography;

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { modules, isLoading } = useModules();

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Title level={2} className="!mb-2">
              Selamat Datang, {user?.nama_lengkap}
            </Title>
            <Paragraph className="!mb-0 text-base text-slate-600">
              Pilih modul di bawah untuk memulai
            </Paragraph>
          </div>

          {user?.nomor_induk_karyawan ? (
            <Tag className="m-0 w-fit rounded-full border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              NIK: {user.nomor_induk_karyawan}
            </Tag>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = getModuleIcon(module.ikon);
          const cardContent = (
            <Card
              hoverable={module.is_aktif}
              onClick={module.is_aktif ? () => navigate(module.path) : undefined}
              className={[
                "h-full rounded-3xl border border-slate-200 shadow-panel transition-all duration-200",
                module.is_aktif
                  ? "cursor-pointer hover:!border-teal-500 hover:-translate-y-1"
                  : "cursor-not-allowed opacity-50",
              ].join(" ")}
              bodyStyle={{ height: "100%" }}
            >
              <div className="flex h-full flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-600">
                  <Icon />
                </div>
                <div className="space-y-2">
                  <Title level={4} className="!mb-0">
                    {module.nama}
                  </Title>
                  <Paragraph className="!mb-0 text-sm leading-6 text-slate-600">
                    {module.deskripsi}
                  </Paragraph>
                </div>
              </div>
            </Card>
          );

          if (!module.is_aktif) {
            return (
              <Badge.Ribbon key={module.id} text="Segera Hadir" color="gold">
                {cardContent}
              </Badge.Ribbon>
            );
          }

          return <div key={module.id}>{cardContent}</div>;
        })}
      </section>
    </div>
  );
}
