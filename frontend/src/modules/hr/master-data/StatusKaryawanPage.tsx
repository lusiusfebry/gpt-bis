import { useSimpleMasterDataPage } from "./shared";

function StatusKaryawanPage() {
  return useSimpleMasterDataPage({
    endpoint: "/hr/master-data/status-karyawan",
    title: "Master Data Status Karyawan",
    description: "Kelola status karyawan yang dipakai pada profil dan informasi HR.",
    entityName: "Status Karyawan",
  });
}

export default StatusKaryawanPage;
