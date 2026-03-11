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
  "bg-primary text-slate-900 font-bold rounded-lg px-4 py-3 flex items-center gap-3 transition-colors";
const INACTIVE_ITEM_CLASS =
  "text-slate-600 hover:bg-slate-100 font-medium rounded-lg px-4 py-3 flex items-center gap-3 transition-colors";

function HrLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const footerCtaLabel = "HR Dashboard";

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

    if (location.pathname === HR_IMPORT_MENU_KEY || location.pathname.startsWith(`${HR_IMPORT_MENU_KEY}/`)) {
      return [HR_IMPORT_MENU_KEY];
    }

    const match = [...HR_MASTER_DATA_MENU_ITEMS]
      .sort((a, b) => b.key.length - a.key.length)
      .find((item) => location.pathname === item.key || location.pathname.startsWith(`${item.key}/`));

    return match ? [match.key] : [];
  }, [location.pathname]);

  const employeeMenuItems = [HR_MASTER_MENU_ITEMS[1], HR_MASTER_MENU_ITEMS[2]];

  return (
    <div className="flex flex-1 flex-col gap-8 lg:flex-row">
      <aside className="w-full lg:flex lg:w-72 lg:min-h-full lg:self-stretch">
        <div className="flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 px-2">
            <h1 className="text-xl font-bold text-slate-900">HR Master Data</h1>
            <p className="text-sm text-slate-500">Organization management</p>
          </div>

          <nav className="flex flex-1 flex-col gap-2" aria-label="HR navigation">
            {HR_MASTER_DATA_MENU_ITEMS.map((item) => {
              const isActive = selectedKeys.includes(item.key);

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigate(item.key)}
                  className={isActive ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="px-4 pt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Manajemen Karyawan
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
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold transition-all hover:bg-slate-300"
            >
              <AppstoreOutlined />
              <span>{footerCtaLabel}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default HrLayout;
