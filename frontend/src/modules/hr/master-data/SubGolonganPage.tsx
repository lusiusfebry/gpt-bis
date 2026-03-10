import { useSimpleMasterDataPage } from "./shared";

function SubGolonganPage() {
  return useSimpleMasterDataPage({
    endpoint: "/hr/master-data/sub-golongan",
    title: "Master Data Sub Golongan",
    description: "Kelola sub golongan untuk detail klasifikasi pangkat karyawan.",
    entityName: "Sub Golongan",
  });
}

export default SubGolonganPage;
