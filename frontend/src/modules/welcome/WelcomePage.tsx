import { useNavigate } from "react-router-dom";
import { getModuleIcon, useModules } from "../app/useModules";
import { Skeleton } from "antd";

const statisticItems = [
  {
    label: "Manpower",
    value: "1,248",
    accent: "+12",
    accentClassName: "bg-green-100 text-green-700",
  },
  {
    label: "Heavy Units",
    value: "84",
    accent: "Active",
    accentClassName: "bg-primary/10 text-primary border border-primary/20",
  },
  {
    label: "System Uptime",
    value: "99.9%",
    accent: "Pulse",
    accentClassName: "bg-green-500",
  },
  {
    label: "LTI Incident",
    value: "0",
    accent: "Day 452",
    accentClassName: "text-slate-500 italic",
  },
] as const;

function WelcomePage() {
  const navigate = useNavigate();
  const { activeModules, isLoading } = useModules();

  const primaryModule = activeModules[0] ?? null;
  const visibleModules = activeModules.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex h-[500px] w-full items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.5), rgba(34, 30, 16, 0.8)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1UjABo8PMOxziJoKAULKJe5RgsN1vHR4BTiz8yR5rUiHvnH4XAg0i_0KtAWDmyXCv4AwX4F6I1HYHkyJtT9mtxf36ysiKP0abUW12XqSRb4YSi1HDRBYvmzduXwMBjjQ4e3WxhBqwwoRLC7moGXPkqUboOkAi17rtApB9QRpeWmvAajzuZYKXfFXr9gqDgp7nska5Xrug34BOGrOcl2ZFjaufkYlj3SqIXqtROSp8YNfalyvpYSJyXahEzPN5uRHEB_RbsMtSr60")',
          }}
        />
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-5xl font-black leading-tight tracking-tighter text-white md:text-7xl">
            Bebang Sistem Informasi
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-slate-200 md:text-xl">
            Site Taliabu Operational Excellence Through Integrated Site Management
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => primaryModule && navigate(primaryModule.path)}
              disabled={!primaryModule}
              className="flex h-14 min-w-[160px] cursor-pointer items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-background-dark transition-transform hover:scale-105 disabled:opacity-75 disabled:hover:scale-100"
            >
              {primaryModule ? "Explore Dashboard" : "Waiting for modules"}
            </button>
            <button
              onClick={() => navigate("/hr")}
              className="flex h-14 min-w-[160px] cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              View Site Specs
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Modules */}
      <section className="relative z-20 -mt-16 px-6 pb-12 md:px-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-8 shadow-xl"
              >
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ))
          ) : visibleModules.length > 0 ? (
            visibleModules.map((module) => {
              const Icon = getModuleIcon(module.ikon);
              return (
                <div
                  key={module.id}
                  onClick={() => navigate(module.path)}
                  className="group flex cursor-pointer flex-col items-start rounded-xl border border-slate-200 bg-white p-8 shadow-xl transition-all hover:border-primary"
                >
                  <div className="mb-6 flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-background-dark">
                    <div className="text-3xl font-bold flex"><Icon /></div>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">{module.nama}</h3>
                  <p className="mb-6 text-slate-500">{module.deskripsi || `Akses modul ${module.nama}`}</p>
                  <div className="mt-auto flex items-center gap-2 font-bold text-primary">
                    <span>Open Module</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm md:col-span-3">
              <h3 className="mb-2 text-xl font-bold text-slate-900">Belum ada modul aktif</h3>
              <p className="text-slate-500">
                Akun ini belum memiliki shortcut modul. Silakan hubungi administrator.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="mt-auto border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8 md:gap-4">
          {statisticItems.map((item) => (
            <div key={item.label} className="flex min-w-[150px] flex-col">
              <span className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="line-clamp-1 text-3xl font-black text-slate-900">
                  {item.value}
                </span>
                {item.accent === "Pulse" ? (
                  <div className={`size-2 animate-pulse rounded-full ${item.accentClassName}`}></div>
                ) : (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${item.accentClassName}`}>
                    {item.accent}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default WelcomePage;
