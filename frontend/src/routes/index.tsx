import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import AuthLayout from "../components/layouts/AuthLayout";
import MainLayout from "../components/layouts/MainLayout";
import { useAuth } from "../modules/auth/AuthContext";
import LoginPage from "../modules/auth/LoginPage";
import HrDashboardPage from "../modules/hr/HrDashboardPage";
import HrLayout from "../modules/hr/HrLayout";
import ImportPage from "../modules/hr/import/ImportPage";
import KaryawanCreatePage from "../modules/hr/karyawan/KaryawanCreatePage";
import KaryawanDetailPage from "../modules/hr/karyawan/KaryawanDetailPage";
import KaryawanListPage from "../modules/hr/karyawan/KaryawanListPage";
import DepartmentPage from "../modules/hr/master-data/DepartmentPage";
import DivisiPage from "../modules/hr/master-data/DivisiPage";
import GolonganPage from "../modules/hr/master-data/GolonganPage";
import JenisHubunganKerjaPage from "../modules/hr/master-data/JenisHubunganKerjaPage";
import KategoriPangkatPage from "../modules/hr/master-data/KategoriPangkatPage";
import LokasiKerjaPage from "../modules/hr/master-data/LokasiKerjaPage";
import PosisiJabatanPage from "../modules/hr/master-data/PosisiJabatanPage";
import StatusKaryawanPage from "../modules/hr/master-data/StatusKaryawanPage";
import SubGolonganPage from "../modules/hr/master-data/SubGolonganPage";
import TagPage from "../modules/hr/master-data/TagPage";
import WelcomePage from "../modules/welcome/WelcomePage";

function LoginRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginRoute />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<Navigate to="/" replace />} />
          <Route path="/hr" element={<HrLayout />}>
            <Route index element={<HrDashboardPage />} />
            <Route path="import" element={<ImportPage />} />
            <Route path="karyawan" element={<KaryawanListPage />} />
            <Route path="karyawan/tambah" element={<KaryawanCreatePage />} />
            <Route path="karyawan/:id" element={<KaryawanDetailPage />} />
            <Route path="master-data/divisi" element={<DivisiPage />} />
            <Route path="master-data/department" element={<DepartmentPage />} />
            <Route path="master-data/posisi-jabatan" element={<PosisiJabatanPage />} />
            <Route path="master-data/kategori-pangkat" element={<KategoriPangkatPage />} />
            <Route path="master-data/golongan" element={<GolonganPage />} />
            <Route path="master-data/sub-golongan" element={<SubGolonganPage />} />
            <Route path="master-data/jenis-hubungan-kerja" element={<JenisHubunganKerjaPage />} />
            <Route path="master-data/tag" element={<TagPage />} />
            <Route path="master-data/lokasi-kerja" element={<LokasiKerjaPage />} />
            <Route path="master-data/status-karyawan" element={<StatusKaryawanPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
