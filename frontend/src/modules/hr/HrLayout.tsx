import { AppstoreOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HR_IMPORT_MENU_KEY,
  HR_KARYAWAN_MENU_KEY,
  HR_KARYAWAN_MENU_PATHS,
  HR_MASTER_DATA_MENU_ITEMS,
  HR_MASTER_MENU_ITEMS,
} from "./master-data/shared";

const ACTIVE_ITEM_CLASS =
  "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-slate-900 font-black transition-all w-full text-left shadow-[0_8px_16px_rgba(242,196,13,0.25)] scale-[1.02]";
const INACTIVE_ITEM_CLASS =
  "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 font-bold transition-all w-full text-left active:scale-95";

function HrLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const footerCtaLabel = "Dashboard Utama";

  const selectedKeys = useMemo(() => {
    const isKaryawanPath =
      HR_KARYAWAN_MENU_PATHS.some(
        (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
      ) ||
      location.pathname === HR_KARYAWAN_MENU_KEY ||
      location.pathname.startsWith(`${HR_KARYAWAN_MENU_KEY}/`);

    if (isKaryawanPath) {
      return [HR_KARYAWAN_MENU_KEY];
    }

    const match = [...HR_MASTER_DATA_MENU_ITEMS]
      .sort((a, b) => b.key.length - a.key.length)
      .find((item) => location.pathname === item.key || location.pathname.startsWith(`${item.key}/`));

    return match ? [match.key] : [];
  }, [location.pathname]);

  const employeeMenuItems = [HR_MASTER_MENU_ITEMS[1]];

  return (
    <div className="flex flex-1 flex-col gap-10 lg:flex-row py-6 px-6 md:px-10">
      <aside className="w-full lg:w-72 flex flex-col shrink-0 gap-6">
        <div className="px-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-primary mb-4 shadow-lg">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Modul HR</h1>
          <p className="text-sm font-medium text-slate-500">Manajemen SDM & Organisasi</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2" aria-label="HR navigation">
          <div className="mb-3 px-4 mt-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Konfigurasi Master
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-1">
            {HR_MASTER_DATA_MENU_ITEMS.map((item) => {
              const isActive = selectedKeys.includes(item.key);

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigate(item.key)}
                  className={isActive ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS}
                >
                  <div className="text-xl flex items-center justify-center w-6 opacity-80">
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 mb-3 px-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Personal & Organisasi
            </h3>
          </div>
          
          {employeeMenuItems.map((item) => {
            const isActive = selectedKeys.includes(item.key);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.key)}
                className={isActive ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS}
              >
                <div className="text-xl flex items-center justify-center w-6">
                  {item.icon}
                </div>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pt-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-bold leading-relaxed text-slate-500">
              Butuh bantuan dengan integrasi data HR?
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white transition-all hover:bg-primary hover:text-slate-900"
            >
              <AppstoreOutlined className="text-lg transition-transform group-hover:rotate-90" />
              <span>{footerCtaLabel}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="min-h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-panel">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default HrLayout;
