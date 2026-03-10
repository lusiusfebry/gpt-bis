import { useSimpleMasterDataPage } from "./shared";

function KategoriPangkatPage() {
  return useSimpleMasterDataPage({
    endpoint: "/hr/master-data/kategori-pangkat",
    title: "Master Data Kategori Pangkat",
    description: "Kelola kategori pangkat yang akan digunakan pada informasi HR karyawan.",
    entityName: "Kategori Pangkat",
  });
}

export default KategoriPangkatPage;
