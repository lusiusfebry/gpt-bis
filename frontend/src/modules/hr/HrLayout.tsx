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
  "flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-slate-900 font-bold transition-all w-full text-left";
const INACTIVE_ITEM_CLASS =
  "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100/80 font-medium transition-all w-full text-left";

function HrLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const footerCtaLabel = "Main Menu";

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
    <div className="flex flex-1 flex-col gap-8 lg:flex-row py-2">
      <aside className="w-full lg:w-72 flex flex-col shrink-0 gap-2">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-slate-900">HR Master Data</h1>
          <p className="text-sm text-slate-500">Organization management</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="HR navigation">
          {HR_MASTER_DATA_MENU_ITEMS.map((item) => {
            const isActive = selectedKeys.includes(item.key);

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.key)}
                className={isActive ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS}
              >
                <div className="text-lg flex items-center justify-center w-6">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mt-6 mb-2 px-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Manajemen Karyawan
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
                <div className="text-lg flex items-center justify-center w-6">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold transition-all hover:bg-slate-300"
          >
            <AppstoreOutlined className="text-lg" />
            <span>{footerCtaLabel}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-6">
        <Outlet />
      </main>
    </div>
  );
}

export default HrLayout;
