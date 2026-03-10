import { useSimpleMasterDataPage } from "./shared";

function DivisiPage() {
  return useSimpleMasterDataPage({
    endpoint: "/hr/master-data/divisi",
    title: "Master Data Divisi",
    description: "Kelola data divisi untuk struktur organisasi HR sesuai konfigurasi master data.",
    entityName: "Divisi",
  });
}

export default DivisiPage;
