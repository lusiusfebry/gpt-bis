export const IMPORT_SESSION_TTL_MS = 30 * 60 * 1000;
export const MAX_IMPORT_ROWS = 1000;
export const IMPORT_SHEET_INDEX = 1;
export const HEADER_ROW_INDEX = 1;
export const FIRST_DATA_ROW_INDEX = 2;

export const HEADER_TYPO_NORMALIZATION_MAP: Record<string, string> = {
  'NOMIR INDUK KARYAWAN': 'NOMOR INDUK KARYAWAN',
  'NOMOR JP 2': 'NOMOR HP 2',
  PROPINSI: 'PROVINSI',
  'TANGGAL LAHUR': 'TANGGAL LAHIR',
  'JENIS KELELAMIN': 'JENIS KELAMIN',
};

export const IMPORT_HEADER_FIELD_MAP: Record<string, string> = {
  'NOMOR INDUK KARYAWAN': 'nomor_induk_karyawan',
  'NAMA LENGKAP': 'nama_lengkap',
  'JENIS KELAMIN': 'jenis_kelamin',
  'TEMPAT LAHIR': 'tempat_lahir',
  'TANGGAL LAHIR': 'tanggal_lahir',
  DIVISI: 'divisi_id',
  DEPARTMENT: 'department_id',
  MANAGER: 'manager_id',
  'ATASAN LANGSUNG': 'atasan_langsung_id',
  'POSISI JABATAN': 'posisi_jabatan_id',
  'EMAIL PERUSAHAAN': 'email_perusahaan',
  'NOMOR HANDPHONE': 'nomor_handphone',
  'NOMOR HP 1': 'nomor_handphone',
  'NOMOR HP 2': 'nomor_handphone_2',
  'STATUS KARYAWAN': 'status_karyawan_id',
  'LOKASI KERJA': 'lokasi_kerja_id',
  TAG: 'tag_id',
  'EMAIL PRIBADI': 'email_pribadi',
  AGAMA: 'agama',
  'GOLONGAN DARAH': 'golongan_darah',
  'NOMOR KARTU KELUARGA': 'nomor_kartu_keluarga',
  'NOMOR KTP': 'nomor_ktp',
  'NOMOR NPWP': 'nomor_npwp',
  'NOMOR BPJS-TK': 'nomor_bpjs',
  'NOMOR BPJS': 'nomor_bpjs',
  'NO NIK KK': 'no_nik_kk',
  'STATUS PAJAK': 'status_pajak',
  'ALAMAT DOMISILI': 'alamat_domisili',
  'KOTA DOMISILI': 'kota_domisili',
  'PROVINSI DOMISILI': 'provinsi_domisili',
  'PROPINSI DOMISILI': 'provinsi_domisili',
  'ALAMAT KTP': 'alamat_ktp',
  'KOTA KTP': 'kota_ktp',
  'PROVINSI KTP': 'provinsi_ktp',
  'PROPINSI KTP': 'provinsi_ktp',
  'NOMOR TELEPON RUMAH 1': 'nomor_telepon_rumah_1',
  'NOMOR TELEPON RUMAH 2': 'nomor_telepon_rumah_2',
  'STATUS PERNIKAHAN': 'status_pernikahan',
  'NAMA PASANGAN NIKAH': 'nama_pasangan',
  'NAMA PASANGAN': 'nama_pasangan',
  'TANGGAL MENIKAH': 'tanggal_menikah',
  'TANGGAL CERAI': 'tanggal_cerai',
  'TANGGAL WAFAT PASANGAN': 'tanggal_wafat_pasangan',
  'PEKERJAAN PASANGAN': 'pekerjaan_pasangan',
  'JUMLAH ANAK': 'jumlah_anak',
  'NOMOR REKENING': 'nomor_rekening',
  'NAMA PEMILIK REKENING': 'nama_pemegang_rekening',
  'NAMA PEMEGANG REKENING': 'nama_pemegang_rekening',
  'NAMA BANK': 'nama_bank',
  'CABANG BANK': 'cabang_bank',
  'JENIS HUBUNGAN KERJA': 'jenis_hubungan_kerja_id',
  'TANGGAL JOIN GROUP': 'tanggal_masuk_group',
  'TANGGAL MASUK': 'tanggal_masuk',
  'TANGGAL TETAP': 'tanggal_permanent',
  'TANGGAL AWAL KONTRAK': 'tanggal_kontrak',
  'TANGGAL AKHIR KONTRAK': 'tanggal_akhir_kontrak',
  'TANGGAL KELUAR': 'tanggal_berhenti',
  'PANGKAT KATEGORI': 'kategori_pangkat_id',
  GOLONGAN: 'golongan_id',
  'SUB GOLONGAN': 'sub_golongan_id',
  'NOMOR DANA PENSIUN': 'no_dana_pensiun',
  'NAMA KONTAK DARURAT 1': 'nama_kontak_darurat_1',
  'NOMOR TELEPON KONTAK DARURAT 1': 'nomor_telepon_kontak_darurat_1',
  'HUBUNGAN KONTAK DARURAT 1': 'hubungan_kontak_darurat_1',
  'ALAMAT KONTAK DARURAT 1': 'alamat_kontak_darurat_1',
  'NAMA KONTAK DARURAT 2': 'nama_kontak_darurat_2',
  'NOMOR TELEPON KONTAK DARURAT 2': 'nomor_telepon_kontak_darurat_2',
  'HUBUNGAN KONTAK DARURAT 2': 'hubungan_kontak_darurat_2',
  'ALAMAT KONTAK DARURAT 2': 'alamat_kontak_darurat_2',
  'POINT OF ORIGINAL': 'point_of_original',
  'POINT OF HIRE': 'point_of_hire',
  'UKURAN SERAGAM KERJA': 'ukuran_seragam_kerja',
  'UKURAN SEPATU KERJA': 'ukuran_sepatu_kerja',
  'LOKASI SEBELUMNYA': 'lokasi_sebelumnya_id',
  'TANGGAL MUTASI': 'tanggal_mutasi',
  'SIKLUS PEMBAYARAN GAJI': 'siklus_pembayaran_gaji',
  'LOKASI COSTING': 'costing',
  ASSIGN: 'assign',
  ACTUAL: 'actual',
  'TANGGAL LAHIR PASANGAN': 'tanggal_lahir_pasangan',
  'PENDIDIKAN TERAKHIR PASANGAN': 'pendidikan_terakhir_pasangan',
  'KETERANGAN PASANGAN': 'keterangan_pasangan',
  'ANAK KE': 'anak_ke',
  'JUMLAH SAUDARA KANDUNG': 'jumlah_saudara_kandung',
  'NAMA AYAH MERTUA': 'nama_ayah_mertua',
  'TANGGAL LAHIR AYAH MERTUA': 'tanggal_lahir_ayah_mertua',
  'PENDIDIKAN TERAKHIR AYAH MERTUA': 'pendidikan_terakhir_ayah_mertua',
  'KETERANGAN AYAH MERTUA': 'keterangan_ayah_mertua',
  'NAMA IBU MERTUA': 'nama_ibu_mertua',
  'TANGGAL LAHIR IBU MERTUA': 'tanggal_lahir_ibu_mertua',
  'PENDIDIKAN TERAKHIR IBU MERTUA': 'pendidikan_terakhir_ibu_mertua',
  'KETERANGAN IBU MERTUA': 'keterangan_ibu_mertua',
  'PENDIDIKAN TERAKHIR': 'tingkat_pendidikan',
  'JURUSAN PENDIDIKAN': 'bidang_studi',
  'NAMA SEKOLAH': 'nama_sekolah',
  'KOTA SEKOLAH': 'kota_sekolah',
  'STATUS PENDIDIKAN': 'status_kelulusan',
  'KETERANGAN PENDIDIKAN': 'keterangan',
};

export const REQUIRED_IMPORT_FIELDS = [
  'nomor_induk_karyawan',
  'nama_lengkap',
  'divisi_id',
  'department_id',
  'posisi_jabatan_id',
  'status_karyawan_id',
  'lokasi_kerja_id',
] as const;

export const DATE_IMPORT_FIELDS = [
  'tanggal_lahir',
  'tanggal_menikah',
  'tanggal_cerai',
  'tanggal_wafat_pasangan',
  'tanggal_masuk_group',
  'tanggal_masuk',
  'tanggal_permanent',
  'tanggal_kontrak',
  'tanggal_akhir_kontrak',
  'tanggal_berhenti',
  'tanggal_mutasi',
  'tanggal_lahir_pasangan',
  'tanggal_lahir_ayah_mertua',
  'tanggal_lahir_ibu_mertua',
] as const;

export const MASTER_LOOKUP_CONFIG = {
  divisi_id: { model: 'divisi', label: 'Divisi' },
  department_id: { model: 'department', label: 'Department' },
  posisi_jabatan_id: { model: 'posisiJabatan', label: 'Posisi jabatan' },
  status_karyawan_id: { model: 'statusKaryawan', label: 'Status karyawan' },
  lokasi_kerja_id: { model: 'lokasiKerja', label: 'Lokasi kerja' },
  tag_id: { model: 'tag', label: 'Tag' },
  jenis_hubungan_kerja_id: {
    model: 'jenisHubunganKerja',
    label: 'Jenis hubungan kerja',
  },
  kategori_pangkat_id: { model: 'kategoriPangkat', label: 'Kategori pangkat' },
  golongan_id: { model: 'golongan', label: 'Golongan' },
  sub_golongan_id: { model: 'subGolongan', label: 'Sub golongan' },
  lokasi_sebelumnya_id: { model: 'lokasiKerja', label: 'Lokasi sebelumnya' },
} as const;

export const FAMILY_GROUP_FIELD_MAP = {
  nama_pasangan: 'nama_pasangan',
  tanggal_lahir_pasangan: 'tanggal_lahir_pasangan',
  pendidikan_terakhir_pasangan: 'pendidikan_terakhir_pasangan',
  pekerjaan_pasangan: 'pekerjaan_pasangan',
  jumlah_anak: 'jumlah_anak',
  keterangan_pasangan: 'keterangan_pasangan',
  anak_ke: 'anak_ke',
  jumlah_saudara_kandung: 'jumlah_saudara_kandung',
  nama_ayah_mertua: 'nama_ayah_mertua',
  tanggal_lahir_ayah_mertua: 'tanggal_lahir_ayah_mertua',
  pendidikan_terakhir_ayah_mertua: 'pendidikan_terakhir_ayah_mertua',
  keterangan_ayah_mertua: 'keterangan_ayah_mertua',
  nama_ibu_mertua: 'nama_ibu_mertua',
  tanggal_lahir_ibu_mertua: 'tanggal_lahir_ibu_mertua',
  pendidikan_terakhir_ibu_mertua: 'pendidikan_terakhir_ibu_mertua',
  keterangan_ibu_mertua: 'keterangan_ibu_mertua',
} as const;

export const EDUCATION_GROUP_FIELD_MAP = {
  tingkat_pendidikan: 'tingkat_pendidikan',
  bidang_studi: 'bidang_studi',
  nama_sekolah: 'nama_sekolah',
  kota_sekolah: 'kota_sekolah',
  status_kelulusan: 'status_kelulusan',
  keterangan: 'keterangan',
} as const;

export const CHILD_GROUP_PREFIXES = {
  nama_anak: 'nama_anak',
  jenis_kelamin: 'jenis_kelamin_anak',
  tanggal_lahir: 'tanggal_lahir_anak',
  keterangan: 'keterangan_anak',
} as const;

export const SIBLING_GROUP_PREFIXES = {
  nama_saudara_kandung: 'nama_saudara_kandung',
  jenis_kelamin: 'jenis_kelamin_saudara_kandung',
  tanggal_lahir: 'tanggal_lahir_saudara_kandung',
  pendidikan_terakhir: 'pendidikan_terakhir_saudara_kandung',
  pekerjaan: 'pekerjaan_saudara_kandung',
  keterangan: 'keterangan_saudara_kandung',
} as const;

export const MAX_SIBLING_GROUP = 5;

export type ImportMasterLookupField = keyof typeof MASTER_LOOKUP_CONFIG;
export type ImportRequiredField = (typeof REQUIRED_IMPORT_FIELDS)[number];
export type ImportDateField = (typeof DATE_IMPORT_FIELDS)[number];

export const IMPORT_ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/octet-stream',
];

export const IMPORT_ALLOWED_EXTENSIONS = ['.xlsx'];
export const IMPORT_MAX_FILE_SIZE = 10 * 1024 * 1024;

export const TEMPLATE_ASSET_RELATIVE_PATH = 'assets/template-import-fix.xlsx';
export const IMPORT_TEMPLATE_DOWNLOAD_NAME = 'template-import-fix.xlsx';
