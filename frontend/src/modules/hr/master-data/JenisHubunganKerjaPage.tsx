import { useSimpleMasterDataPage } from "./shared";

function JenisHubunganKerjaPage() {
  return useSimpleMasterDataPage({
    endpoint: "/hr/master-data/jenis-hubungan-kerja",
    title: "Master Data Jenis Hubungan Kerja",
    description: "Kelola jenis hubungan kerja yang dipakai pada kontrak dan status kepegawaian.",
    entityName: "Jenis Hubungan Kerja",
  });
}

export default JenisHubunganKerjaPage;
