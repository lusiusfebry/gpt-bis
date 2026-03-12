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
      <section className="relative flex h-[600px] w-full items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-110"
          style={{
            backgroundImage:
              'linear-gradient(rgba(15, 23, 42, 0.4), rgba(34, 30, 16, 0.95)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1UjABo8PMOxziJoKAULKJe5RgsN1vHR4BTiz8yR5rUiHvnH4XAg0i_0KtAWDmyXCv4AwX4F6I1HYHkyJtT9mtxf36ysiKP0abUW12XqSRb4YSi1HDRBYvmzduXwMBjjQ4e3WxhBqwwoRLC7moGXPkqUboOkAi17rtApB9QRpeWmvAajzuZYKXfFXr9gqDgp7nska5Xrug34BOGrOcl2ZFjaufkYlj3SqIXqtROSp8YNfalyvpYSJyXahEzPN5uRHEB_RbsMtSr60")',
          }}
        />
        
        {/* Animated Particles/Accents Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,196,13,0.1),transparent_70%)]"></div>

        <div className="relative z-10 max-w-5xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Site Taliabu Live Operations
            </span>
          </div>
          
          <h1 className="mb-6 text-6xl font-black leading-[1.1] tracking-tighter text-white md:text-8xl">
            Bebang <span className="text-primary italic">Sistem</span><br />Informasi
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-slate-300 md:text-xl leading-relaxed">
            Operational Excellence Through Integrated Site Management. Streamlining HR, Logistics, and Site Security.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => primaryModule && navigate(primaryModule.path)}
              disabled={!primaryModule}
              className="group relative flex h-16 min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-8 text-base font-black text-background-dark transition-all hover:shadow-[0_0_20px_rgba(242,196,13,0.4)] active:scale-95 disabled:opacity-75"
            >
              <span className="relative z-10">{primaryModule ? "Explore Dashboard" : "Waiting for modules"}</span>
            </button>
            <button
              onClick={() => navigate("/hr")}
              className="group flex h-16 min-w-[200px] cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 text-base font-black text-white backdrop-blur-xl transition-all hover:bg-white/10 active:scale-95"
            >
              <span className="material-symbols-outlined mr-2 transition-transform group-hover:rotate-12">info</span>
              View Site Specs
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Modules */}
      <section className="relative z-20 -mt-20 px-6 pb-16 md:px-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-10 shadow-xl"
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
                  className="group relative flex cursor-pointer flex-col items-start overflow-hidden rounded-2xl border border-slate-200 bg-white p-10 shadow-premium transition-all hover:-translate-y-2 hover:border-primary/50"
                >
                  <div className="absolute -right-4 -top-4 size-32 rotate-12 bg-primary/5 transition-transform group-hover:scale-110"></div>
                  
                  <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-slate-900 text-primary transition-all group-hover:bg-primary group-hover:text-background-dark group-hover:shadow-[0_8px_16px_rgba(242,196,13,0.3)]">
                    <div className="text-3xl font-bold flex"><Icon /></div>
                  </div>
                  
                  <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900">{module.nama}</h3>
                  <p className="mb-8 text-slate-500 font-medium leading-relaxed">{module.deskripsi || `Akses modul komprehensif ${module.nama} untuk manajemen site.`}</p>
                  
                  <div className="mt-auto flex items-center gap-3 font-black uppercase tracking-widest text-[10px] text-primary">
                    <span>Akses Modul</span>
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-16 text-center backdrop-blur-sm md:col-span-3">
              <span className="material-symbols-outlined mb-4 text-5xl text-slate-400">inventory_2</span>
              <h3 className="mb-2 text-xl font-bold text-slate-900">Belum ada modul aktif</h3>
              <p className="text-slate-500 font-medium">
                Akun ini belum memiliki shortcut modul. Silakan hubungi administrator.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="mt-auto bg-slate-900 px-6 py-12 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 md:grid-cols-4">
          {statisticItems.map((item) => (
            <div key={item.label} className="group flex flex-col border-l border-white/10 pl-8 transition-colors hover:border-primary">
              <span className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary">
                {item.label}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black tracking-tighter text-white">
                  {item.value}
                </span>
                {item.accent === "Pulse" ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-black text-green-500 border border-green-500/20">
                    <div className="size-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    ONLINE
                  </div>
                ) : (
                  <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${item.accentClassName.replace('bg-primary/10', 'bg-primary/20')}`}>
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
