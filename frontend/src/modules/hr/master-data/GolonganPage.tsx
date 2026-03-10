import { useSimpleMasterDataPage } from "./shared";

function GolonganPage() {
  return useSimpleMasterDataPage({
    endpoint: "/hr/master-data/golongan",
    title: "Master Data Golongan",
    description: "Kelola golongan yang dipakai dalam struktur pangkat karyawan.",
    entityName: "Golongan",
  });
}

export default GolonganPage;
