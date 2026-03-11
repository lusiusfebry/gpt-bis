import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';

import { generateMasterDataCode } from '../src/common/utils/code-generator.util';

const prisma = new PrismaClient();

const APP_MODULES = [
  {
    kode: 'hr',
    nama: 'Human Resources',
    deskripsi:
      'Kelola data karyawan, struktur organisasi, dan administrasi SDM',
    ikon: 'TeamOutlined',
    path: '/hr',
    is_aktif: true,
    urutan: 1,
  },
  {
    kode: 'inventory',
    nama: 'Inventory',
    deskripsi: 'Kelola inventaris dan aset perusahaan',
    ikon: 'InboxOutlined',
    path: '/inventory',
    is_aktif: false,
    urutan: 2,
  },
  {
    kode: 'mess',
    nama: 'Mess Management',
    deskripsi: 'Kelola fasilitas mess dan penghunian karyawan',
    ikon: 'HomeOutlined',
    path: '/mess',
    is_aktif: false,
    urutan: 3,
  },
  {
    kode: 'building',
    nama: 'Building Management',
    deskripsi: 'Kelola gedung, fasilitas, dan pemeliharaan bangunan',
    ikon: 'BankOutlined',
    path: '/building',
    is_aktif: false,
    urutan: 4,
  },
  {
    kode: 'uarm',
    nama: 'User Access Right Management',
    deskripsi: 'Kelola hak akses pengguna dan keamanan sistem',
    ikon: 'SafetyOutlined',
    path: '/uarm',
    is_aktif: false,
    urutan: 5,
  },
] as const;

const MASTER_DATA = {
  divisi: [
    {
      key: 'hr',
      nama: 'HR',
      keterangan: 'Divisi Human Resources',
      status: 'Aktif',
    },
    {
      key: 'produksi',
      nama: 'Produksi',
      keterangan: 'Divisi operasional produksi',
      status: 'Aktif',
    },
    {
      key: 'it-development',
      nama: 'IT Development',
      keterangan: 'Divisi pengembangan sistem dan aplikasi',
      status: 'Aktif',
    },
  ],
  department: [
    {
      key: 'hr',
      nama: 'HR',
      divisiKey: 'hr',
      keterangan: 'Department Human Resources',
      status: 'Aktif',
    },
    {
      key: 'rekrutmen',
      nama: 'Rekrutmen',
      divisiKey: 'hr',
      keterangan: 'Department rekrutmen dan talent acquisition',
      status: 'Aktif',
    },
    {
      key: 'produksi',
      nama: 'Produksi',
      divisiKey: 'produksi',
      keterangan: 'Department produksi utama',
      status: 'Aktif',
    },
    {
      key: 'quality-control',
      nama: 'Quality Control',
      divisiKey: 'produksi',
      keterangan: 'Department quality control produksi',
      status: 'Aktif',
    },
    {
      key: 'it-development',
      nama: 'IT Development',
      divisiKey: 'it-development',
      keterangan: 'Department pengembangan aplikasi internal',
      status: 'Aktif',
    },
  ],
  posisiJabatan: [
    {
      key: 'head-hr',
      nama: 'Head HR',
      departmentKey: 'hr',
      keterangan: 'Kepala department HR',
      status: 'Aktif',
    },
    {
      key: 'staff-rekrutmen',
      nama: 'Staff Rekrutmen',
      departmentKey: 'rekrutmen',
      keterangan: 'Staff rekrutmen dan administrasi kandidat',
      status: 'Aktif',
    },
    {
      key: 'head-produksi',
      nama: 'Head Produksi',
      departmentKey: 'produksi',
      keterangan: 'Kepala department produksi',
      status: 'Aktif',
    },
    {
      key: 'operator-produksi',
      nama: 'Operator Produksi',
      departmentKey: 'produksi',
      keterangan: 'Pelaksana operasional produksi',
      status: 'Aktif',
    },
    {
      key: 'staff-qc',
      nama: 'Staff Quality Control',
      departmentKey: 'quality-control',
      keterangan: 'Staff quality control',
      status: 'Aktif',
    },
    {
      key: 'head-it-development',
      nama: 'Head IT Development',
      departmentKey: 'it-development',
      keterangan: 'Kepala department IT Development',
      status: 'Aktif',
    },
    {
      key: 'backend-developer',
      nama: 'Backend Developer',
      departmentKey: 'it-development',
      keterangan: 'Developer backend aplikasi',
      status: 'Aktif',
    },
    {
      key: 'frontend-developer',
      nama: 'Frontend Developer',
      departmentKey: 'it-development',
      keterangan: 'Developer frontend aplikasi',
      status: 'Aktif',
    },
  ],
  kategoriPangkat: [
    {
      key: 'staff',
      nama: 'Staff',
      keterangan: 'Kategori pangkat staff',
      status: 'Aktif',
    },
    {
      key: 'supervisor',
      nama: 'Supervisor',
      keterangan: 'Kategori pangkat supervisor',
      status: 'Aktif',
    },
    {
      key: 'manager',
      nama: 'Manager',
      keterangan: 'Kategori pangkat manager',
      status: 'Aktif',
    },
  ],
  golongan: [
    {
      key: 'gol-a',
      nama: 'Golongan A',
      keterangan: 'Golongan dasar',
      status: 'Aktif',
    },
    {
      key: 'gol-b',
      nama: 'Golongan B',
      keterangan: 'Golongan menengah',
      status: 'Aktif',
    },
    {
      key: 'gol-c',
      nama: 'Golongan C',
      keterangan: 'Golongan manajerial',
      status: 'Aktif',
    },
  ],
  subGolongan: [
    {
      key: 'sub-a1',
      nama: 'Sub Golongan A1',
      keterangan: 'Sub golongan staff junior',
      status: 'Aktif',
    },
    {
      key: 'sub-b1',
      nama: 'Sub Golongan B1',
      keterangan: 'Sub golongan staff senior',
      status: 'Aktif',
    },
    {
      key: 'sub-c1',
      nama: 'Sub Golongan C1',
      keterangan: 'Sub golongan head department',
      status: 'Aktif',
    },
  ],
  jenisHubunganKerja: [
    {
      key: 'permanent',
      nama: 'Permanent',
      keterangan: 'Karyawan tetap',
      status: 'Aktif',
    },
    {
      key: 'contract',
      nama: 'Contract',
      keterangan: 'Karyawan kontrak',
      status: 'Aktif',
    },
    {
      key: 'probation',
      nama: 'Probation',
      keterangan: 'Karyawan masa percobaan',
      status: 'Aktif',
    },
  ],
  tag: [
    {
      key: 'head',
      nama: 'Head',
      warna_tag: '#1D4ED8',
      keterangan: 'Karyawan level kepala department',
      status: 'Aktif',
    },
    {
      key: 'staff',
      nama: 'Staff',
      warna_tag: '#059669',
      keterangan: 'Karyawan level staff',
      status: 'Aktif',
    },
    {
      key: 'kontrak',
      nama: 'Kontrak',
      warna_tag: '#D97706',
      keterangan: 'Karyawan kontrak',
      status: 'Aktif',
    },
    {
      key: 'non-aktif',
      nama: 'Non-Aktif',
      warna_tag: '#DC2626',
      keterangan: 'Karyawan tidak aktif',
      status: 'Aktif',
    },
  ],
  lokasiKerja: [
    {
      key: 'ho-jakarta',
      nama: 'Head Office Jakarta',
      alamat: 'Jl. Jenderal Sudirman No. 88, Jakarta Selatan',
      keterangan: 'Kantor pusat',
      status: 'Aktif',
    },
    {
      key: 'plant-bekasi',
      nama: 'Plant Bekasi',
      alamat: 'Kawasan Industri MM2100, Bekasi',
      keterangan: 'Pabrik dan operasional produksi',
      status: 'Aktif',
    },
    {
      key: 'site-cikarang',
      nama: 'Site Cikarang',
      alamat: 'Jl. Raya Cikarang No. 12, Bekasi',
      keterangan: 'Lokasi kerja proyek dan support',
      status: 'Aktif',
    },
  ],
  statusKaryawan: [
    {
      key: 'aktif',
      nama: 'Aktif',
      keterangan: 'Karyawan aktif bekerja',
      status: 'Aktif',
    },
    {
      key: 'cuti',
      nama: 'Cuti',
      keterangan: 'Karyawan sedang cuti',
      status: 'Aktif',
    },
    {
      key: 'non-aktif',
      nama: 'Non-Aktif',
      keterangan: 'Karyawan tidak aktif',
      status: 'Aktif',
    },
  ],
} as const;

const USER_SEEDS = [
  {
    nomor_induk_karyawan: '02-03827',
    nama_lengkap: 'Administrator Sistem',
    statusKey: 'aktif',
  },
  {
    nomor_induk_karyawan: '02-03828',
    nama_lengkap: 'Rina Hartati',
    statusKey: 'aktif',
  },
  {
    nomor_induk_karyawan: '02-03829',
    nama_lengkap: 'Budi Santoso',
    statusKey: 'aktif',
  },
  {
    nomor_induk_karyawan: '02-03830',
    nama_lengkap: 'Dewi Lestari',
    statusKey: 'aktif',
  },
  {
    nomor_induk_karyawan: '02-03831',
    nama_lengkap: 'Andi Saputra',
    statusKey: 'aktif',
  },
  {
    nomor_induk_karyawan: '02-03832',
    nama_lengkap: 'Siti Rahma',
    statusKey: 'aktif',
  },
  {
    nomor_induk_karyawan: '02-03833',
    nama_lengkap: 'Eko Prasetyo',
    statusKey: 'cuti',
  },
  {
    nomor_induk_karyawan: '02-03834',
    nama_lengkap: 'Maya Putri',
    statusKey: 'non-aktif',
  },
] as const;

const EMPLOYEE_SEEDS = [
  {
    nomor_induk_karyawan: '02-03827',
    nama_lengkap: 'Administrator Sistem',
    userNik: '02-03827',
    divisiKey: 'it-development',
    departmentKey: 'it-development',
    posisiKey: 'head-it-development',
    managerNik: undefined,
    atasanLangsungNik: undefined,
    statusKey: 'aktif',
    lokasiKerjaKey: 'ho-jakarta',
    tagKey: 'head',
    jenisHubunganKerjaKey: 'permanent',
    kategoriPangkatKey: 'manager',
    golonganKey: 'gol-c',
    subGolonganKey: 'sub-c1',
    lokasiSebelumnyaKey: undefined,
    scalar: {
      email_perusahaan: 'administrator@bebang.local',
      nomor_handphone: '081200000001',
      jenis_kelamin: 'Laki-laki',
      tempat_lahir: 'Jakarta',
      tanggal_lahir: new Date('1990-01-15T00:00:00.000Z'),
      email_pribadi: 'administrator.sistem@example.com',
      agama: 'Islam',
      golongan_darah: 'O',
      nomor_kartu_keluarga: '3174001001001001',
      nomor_ktp: '3174001001001001',
      nomor_npwp: '01.234.567.8-901.000',
      nomor_bpjs: 'BPJS000001',
      no_nik_kk: 'NIKKK000001',
      status_pajak: 'K/2',
      alamat_domisili: 'Jl. Melati No. 10, Jakarta Selatan',
      kota_domisili: 'Jakarta Selatan',
      provinsi_domisili: 'DKI Jakarta',
      alamat_ktp: 'Jl. Melati No. 10, Jakarta Selatan',
      kota_ktp: 'Jakarta Selatan',
      provinsi_ktp: 'DKI Jakarta',
      nomor_handphone_1: '081200000001',
      nomor_handphone_2: '081200000101',
      nomor_telepon_rumah_1: '0217000001',
      nomor_telepon_rumah_2: '0217000002',
      status_pernikahan: 'Menikah',
      nama_pasangan: 'Nadia Permata',
      tanggal_menikah: new Date('2016-09-10T00:00:00.000Z'),
      pekerjaan_pasangan: 'Konsultan',
      jumlah_anak: 2,
      nomor_rekening: '1000000001',
      nama_pemegang_rekening: 'Administrator Sistem',
      nama_bank: 'BCA',
      cabang_bank: 'Sudirman',
      tanggal_masuk_group: new Date('2015-02-01T00:00:00.000Z'),
      tanggal_masuk: new Date('2015-02-01T00:00:00.000Z'),
      tanggal_permanent: new Date('2016-02-01T00:00:00.000Z'),
      no_dana_pensiun: 'DPLK000001',
      nama_kontak_darurat_1: 'Nadia Permata',
      nomor_telepon_kontak_darurat_1: '081200000201',
      hubungan_kontak_darurat_1: 'Istri',
      alamat_kontak_darurat_1: 'Jl. Melati No. 10, Jakarta Selatan',
      nama_kontak_darurat_2: 'Bambang Surya',
      nomor_telepon_kontak_darurat_2: '081200000202',
      hubungan_kontak_darurat_2: 'Saudara',
      alamat_kontak_darurat_2: 'Jl. Mawar No. 8, Jakarta',
      point_of_original: 'Jakarta',
      point_of_hire: 'Jakarta',
      ukuran_seragam_kerja: 'L',
      ukuran_sepatu_kerja: '42',
      siklus_pembayaran_gaji: 'Bulanan',
      costing: 'IT-HO-001',
      assign: 'Project Internal',
      actual: 'IT Development',
      tanggal_lahir_pasangan: new Date('1991-04-12T00:00:00.000Z'),
      pendidikan_terakhir_pasangan: 'S1 Manajemen',
      keterangan_pasangan: 'Pasangan aktif bekerja',
      anak_ke: 1,
      jumlah_saudara_kandung: 3,
      nama_ayah_mertua: 'Suhendra',
      tanggal_lahir_ayah_mertua: new Date('1961-03-05T00:00:00.000Z'),
      pendidikan_terakhir_ayah_mertua: 'SMA',
      keterangan_ayah_mertua: 'Wiraswasta',
      nama_ibu_mertua: 'Sulastri',
      tanggal_lahir_ibu_mertua: new Date('1964-07-18T00:00:00.000Z'),
      pendidikan_terakhir_ibu_mertua: 'SMA',
      keterangan_ibu_mertua: 'Ibu rumah tangga',
    },
    family: {
      nama_pasangan: 'Nadia Permata',
      tanggal_lahir_pasangan: new Date('1991-04-12T00:00:00.000Z'),
      pendidikan_terakhir_pasangan: 'S1 Manajemen',
      pekerjaan_pasangan: 'Konsultan',
      jumlah_anak: 2,
      keterangan_pasangan: 'Pasangan aktif bekerja',
      anak_ke: 1,
      jumlah_saudara_kandung: 3,
      nama_ayah_mertua: 'Suhendra',
      tanggal_lahir_ayah_mertua: new Date('1961-03-05T00:00:00.000Z'),
      pendidikan_terakhir_ayah_mertua: 'SMA',
      keterangan_ayah_mertua: 'Wiraswasta',
      nama_ibu_mertua: 'Sulastri',
      tanggal_lahir_ibu_mertua: new Date('1964-07-18T00:00:00.000Z'),
      pendidikan_terakhir_ibu_mertua: 'SMA',
      keterangan_ibu_mertua: 'Ibu rumah tangga',
    },
    children: [
      {
        nama_anak: 'Alya Sistem',
        jenis_kelamin: 'Perempuan',
        tanggal_lahir: new Date('2017-06-10T00:00:00.000Z'),
        keterangan: 'Anak pertama',
      },
      {
        nama_anak: 'Arka Sistem',
        jenis_kelamin: 'Laki-laki',
        tanggal_lahir: new Date('2020-08-21T00:00:00.000Z'),
        keterangan: 'Anak kedua',
      },
    ],
    siblings: [
      {
        nama_saudara_kandung: 'Dimas Sistem',
        jenis_kelamin: 'Laki-laki',
        tanggal_lahir: new Date('1988-09-12T00:00:00.000Z'),
        pendidikan_terakhir: 'S1 Teknik Informatika',
        pekerjaan: 'System Analyst',
        keterangan: 'Kakak kandung',
      },
      {
        nama_saudara_kandung: 'Rani Sistem',
        jenis_kelamin: 'Perempuan',
        tanggal_lahir: new Date('1993-01-23T00:00:00.000Z'),
        pendidikan_terakhir: 'S1 Akuntansi',
        pekerjaan: 'Finance Officer',
        keterangan: 'Adik kandung',
      },
    ],
    educations: [
      {
        tingkat_pendidikan: 'S1',
        bidang_studi: 'Teknik Informatika',
        nama_sekolah: 'Universitas Indonesia',
        kota_sekolah: 'Depok',
        status_kelulusan: 'Lulus',
        keterangan: 'Sarjana',
      },
      {
        tingkat_pendidikan: 'S2',
        bidang_studi: 'Sistem Informasi',
        nama_sekolah: 'Binus University',
        kota_sekolah: 'Jakarta',
        status_kelulusan: 'Lulus',
        keterangan: 'Magister',
      },
    ],
  },
  {
    nomor_induk_karyawan: '02-03828',
    nama_lengkap: 'Rina Hartati',
    userNik: '02-03828',
    divisiKey: 'hr',
    departmentKey: 'hr',
    posisiKey: 'head-hr',
    managerNik: undefined,
    atasanLangsungNik: undefined,
    statusKey: 'aktif',
    lokasiKerjaKey: 'ho-jakarta',
    tagKey: 'head',
    jenisHubunganKerjaKey: 'permanent',
    kategoriPangkatKey: 'manager',
    golonganKey: 'gol-c',
    subGolonganKey: 'sub-c1',
    lokasiSebelumnyaKey: undefined,
    scalar: {
      email_perusahaan: 'rina.hartati@bebang.local',
      nomor_handphone: '081200000002',
      jenis_kelamin: 'Perempuan',
      tempat_lahir: 'Bandung',
      tanggal_lahir: new Date('1989-05-20T00:00:00.000Z'),
      email_pribadi: 'rina.hartati@example.com',
      agama: 'Islam',
      golongan_darah: 'A',
      nomor_kartu_keluarga: '3273002002002002',
      nomor_ktp: '3273002002002002',
      nomor_npwp: '02.234.567.8-901.000',
      nomor_bpjs: 'BPJS000002',
      no_nik_kk: 'NIKKK000002',
      status_pajak: 'K/1',
      alamat_domisili: 'Jl. Anggrek No. 21, Bandung',
      kota_domisili: 'Bandung',
      provinsi_domisili: 'Jawa Barat',
      alamat_ktp: 'Jl. Anggrek No. 21, Bandung',
      kota_ktp: 'Bandung',
      provinsi_ktp: 'Jawa Barat',
      nomor_handphone_1: '081200000002',
      nomor_handphone_2: '081200000102',
      nomor_telepon_rumah_1: '0227000001',
      nomor_telepon_rumah_2: '0227000002',
      status_pernikahan: 'Menikah',
      nama_pasangan: 'Agus Hidayat',
      tanggal_menikah: new Date('2014-11-15T00:00:00.000Z'),
      pekerjaan_pasangan: 'Konsultan HR',
      jumlah_anak: 1,
      nomor_rekening: '1000000002',
      nama_pemegang_rekening: 'Rina Hartati',
      nama_bank: 'Mandiri',
      cabang_bank: 'Bandung Asia Afrika',
      tanggal_masuk_group: new Date('2014-04-01T00:00:00.000Z'),
      tanggal_masuk: new Date('2014-04-01T00:00:00.000Z'),
      tanggal_permanent: new Date('2015-04-01T00:00:00.000Z'),
      no_dana_pensiun: 'DPLK000002',
      nama_kontak_darurat_1: 'Agus Hidayat',
      nomor_telepon_kontak_darurat_1: '081200000301',
      hubungan_kontak_darurat_1: 'Suami',
      alamat_kontak_darurat_1: 'Jl. Anggrek No. 21, Bandung',
      point_of_original: 'Bandung',
      point_of_hire: 'Jakarta',
      ukuran_seragam_kerja: 'M',
      ukuran_sepatu_kerja: '38',
      siklus_pembayaran_gaji: 'Bulanan',
      costing: 'HR-HO-001',
      assign: 'HR Strategic',
      actual: 'Human Resources',
      tanggal_lahir_pasangan: new Date('1988-12-09T00:00:00.000Z'),
      pendidikan_terakhir_pasangan: 'S1 Psikologi',
      keterangan_pasangan: 'Pasangan bekerja sebagai konsultan',
      anak_ke: 2,
      jumlah_saudara_kandung: 2,
      nama_ayah_mertua: 'Herman Hidayat',
      tanggal_lahir_ayah_mertua: new Date('1958-02-13T00:00:00.000Z'),
      pendidikan_terakhir_ayah_mertua: 'SMA',
      keterangan_ayah_mertua: 'Pensiunan',
      nama_ibu_mertua: 'Ratna Hidayat',
      tanggal_lahir_ibu_mertua: new Date('1960-10-28T00:00:00.000Z'),
      pendidikan_terakhir_ibu_mertua: 'SMA',
      keterangan_ibu_mertua: 'Ibu rumah tangga',
    },
    family: {
      nama_pasangan: 'Agus Hidayat',
      tanggal_lahir_pasangan: new Date('1988-12-09T00:00:00.000Z'),
      pendidikan_terakhir_pasangan: 'S1 Psikologi',
      pekerjaan_pasangan: 'Konsultan HR',
      jumlah_anak: 1,
      keterangan_pasangan: 'Pasangan bekerja sebagai konsultan',
      anak_ke: 2,
      jumlah_saudara_kandung: 2,
      nama_ayah_mertua: 'Herman Hidayat',
      tanggal_lahir_ayah_mertua: new Date('1958-02-13T00:00:00.000Z'),
      pendidikan_terakhir_ayah_mertua: 'SMA',
      keterangan_ayah_mertua: 'Pensiunan',
      nama_ibu_mertua: 'Ratna Hidayat',
      tanggal_lahir_ibu_mertua: new Date('1960-10-28T00:00:00.000Z'),
      pendidikan_terakhir_ibu_mertua: 'SMA',
      keterangan_ibu_mertua: 'Ibu rumah tangga',
    },
    children: [
      {
        nama_anak: 'Naya Hidayat',
        jenis_kelamin: 'Perempuan',
        tanggal_lahir: new Date('2018-03-15T00:00:00.000Z'),
        keterangan: 'Anak tunggal',
      },
    ],
    siblings: [
      {
        nama_saudara_kandung: 'Dewi Hartati',
        jenis_kelamin: 'Perempuan',
        tanggal_lahir: new Date('1991-07-11T00:00:00.000Z'),
        pendidikan_terakhir: 'S1 Hukum',
        pekerjaan: 'Legal Officer',
        keterangan: 'Adik kandung',
      },
    ],
    educations: [
      {
        tingkat_pendidikan: 'S1',
        bidang_studi: 'Psikologi',
        nama_sekolah: 'Universitas Padjadjaran',
        kota_sekolah: 'Bandung',
        status_kelulusan: 'Lulus',
        keterangan: 'Sarjana',
      },
    ],
  },
  {
    nomor_induk_karyawan: '02-03829',
    nama_lengkap: 'Budi Santoso',
    userNik: '02-03829',
    divisiKey: 'produksi',
    departmentKey: 'produksi',
    posisiKey: 'head-produksi',
    managerNik: undefined,
    atasanLangsungNik: undefined,
    statusKey: 'aktif',
    lokasiKerjaKey: 'plant-bekasi',
    tagKey: 'head',
    jenisHubunganKerjaKey: 'permanent',
    kategoriPangkatKey: 'manager',
    golonganKey: 'gol-c',
    subGolonganKey: 'sub-c1',
    lokasiSebelumnyaKey: 'site-cikarang',
    scalar: {
      email_perusahaan: 'budi.santoso@bebang.local',
      nomor_handphone: '081200000003',
      jenis_kelamin: 'Laki-laki',
      tempat_lahir: 'Semarang',
      tanggal_lahir: new Date('1987-08-07T00:00:00.000Z'),
      email_pribadi: 'budi.santoso@example.com',
      agama: 'Islam',
      golongan_darah: 'B',
      nomor_kartu_keluarga: '3374003003003003',
      nomor_ktp: '3374003003003003',
      nomor_npwp: '03.234.567.8-901.000',
      nomor_bpjs: 'BPJS000003',
      no_nik_kk: 'NIKKK000003',
      status_pajak: 'K/3',
      alamat_domisili: 'Jl. Kenanga No. 7, Bekasi',
      kota_domisili: 'Bekasi',
      provinsi_domisili: 'Jawa Barat',
      alamat_ktp: 'Jl. Kenanga No. 7, Bekasi',
      kota_ktp: 'Bekasi',
      provinsi_ktp: 'Jawa Barat',
      nomor_handphone_1: '081200000003',
      nomor_handphone_2: '081200000103',
      nomor_telepon_rumah_1: '0218000001',
      nomor_telepon_rumah_2: '0218000002',
      status_pernikahan: 'Menikah',
      nama_pasangan: 'Lina Santoso',
      tanggal_menikah: new Date('2012-05-06T00:00:00.000Z'),
      pekerjaan_pasangan: 'Guru',
      jumlah_anak: 2,
      nomor_rekening: '1000000003',
      nama_pemegang_rekening: 'Budi Santoso',
      nama_bank: 'BRI',
      cabang_bank: 'Bekasi',
      tanggal_masuk_group: new Date('2013-06-01T00:00:00.000Z'),
      tanggal_masuk: new Date('2013-06-01T00:00:00.000Z'),
      tanggal_permanent: new Date('2014-06-01T00:00:00.000Z'),
      no_dana_pensiun: 'DPLK000003',
      nama_kontak_darurat_1: 'Lina Santoso',
      nomor_telepon_kontak_darurat_1: '081200000401',
      hubungan_kontak_darurat_1: 'Istri',
      alamat_kontak_darurat_1: 'Jl. Kenanga No. 7, Bekasi',
      point_of_original: 'Semarang',
      point_of_hire: 'Bekasi',
      ukuran_seragam_kerja: 'XL',
      ukuran_sepatu_kerja: '43',
      tanggal_mutasi: new Date('2021-01-10T00:00:00.000Z'),
      siklus_pembayaran_gaji: 'Bulanan',
      costing: 'PRD-PLANT-001',
      assign: 'Operasional Produksi',
      actual: 'Plant Bekasi',
      tanggal_lahir_pasangan: new Date('1989-09-22T00:00:00.000Z'),
      pendidikan_terakhir_pasangan: 'S1 Pendidikan',
      keterangan_pasangan: 'Guru sekolah dasar',
      anak_ke: 1,
      jumlah_saudara_kandung: 4,
      nama_ayah_mertua: 'Rahmat',
      tanggal_lahir_ayah_mertua: new Date('1959-11-10T00:00:00.000Z'),
      pendidikan_terakhir_ayah_mertua: 'SMA',
      keterangan_ayah_mertua: 'Petani',
      nama_ibu_mertua: 'Sri Wahyuni',
      tanggal_lahir_ibu_mertua: new Date('1962-01-27T00:00:00.000Z'),
      pendidikan_terakhir_ibu_mertua: 'SMP',
      keterangan_ibu_mertua: 'Ibu rumah tangga',
    },
    family: {
      nama_pasangan: 'Lina Santoso',
      tanggal_lahir_pasangan: new Date('1989-09-22T00:00:00.000Z'),
      pendidikan_terakhir_pasangan: 'S1 Pendidikan',
      pekerjaan_pasangan: 'Guru',
      jumlah_anak: 2,
      keterangan_pasangan: 'Guru sekolah dasar',
      anak_ke: 1,
      jumlah_saudara_kandung: 4,
      nama_ayah_mertua: 'Rahmat',
      tanggal_lahir_ayah_mertua: new Date('1959-11-10T00:00:00.000Z'),
      pendidikan_terakhir_ayah_mertua: 'SMA',
      keterangan_ayah_mertua: 'Petani',
      nama_ibu_mertua: 'Sri Wahyuni',
      tanggal_lahir_ibu_mertua: new Date('1962-01-27T00:00:00.000Z'),
      pendidikan_terakhir_ibu_mertua: 'SMP',
      keterangan_ibu_mertua: 'Ibu rumah tangga',
    },
    children: [
      {
        nama_anak: 'Galang Santoso',
        jenis_kelamin: 'Laki-laki',
        tanggal_lahir: new Date('2014-02-14T00:00:00.000Z'),
        keterangan: 'Anak pertama',
      },
      {
        nama_anak: 'Gita Santoso',
        jenis_kelamin: 'Perempuan',
        tanggal_lahir: new Date('2019-10-01T00:00:00.000Z'),
        keterangan: 'Anak kedua',
      },
    ],
    siblings: [
      {
        nama_saudara_kandung: 'Agus Santoso',
        jenis_kelamin: 'Laki-laki',
        tanggal_lahir: new Date('1984-06-17T00:00:00.000Z'),
        pendidikan_terakhir: 'D3 Mesin',
        pekerjaan: 'Supervisor Pabrik',
        keterangan: 'Kakak kandung',
      },
      {
        nama_saudara_kandung: 'Rudi Santoso',
        jenis_kelamin: 'Laki-laki',
        tanggal_lahir: new Date('1990-12-20T00:00:00.000Z'),
        pendidikan_terakhir: 'SMA',
        pekerjaan: 'Wiraswasta',
        keterangan: 'Adik kandung',
      },
    ],
    educations: [
      {
        tingkat_pendidikan: 'D3',
        bidang_studi: 'Teknik Mesin',
        nama_sekolah: 'Politeknik Negeri Semarang',
        kota_sekolah: 'Semarang',
        status_kelulusan: 'Lulus',
        keterangan: 'Diploma',
      },
    ],
  },
  {
    nomor_induk_karyawan: '02-03830',
    nama_lengkap: 'Dewi Lestari',
    userNik: '02-03830',
    divisiKey: 'hr',
    departmentKey: 'rekrutmen',
    posisiKey: 'staff-rekrutmen',
    managerNik: '02-03828',
    atasanLangsungNik: '02-03828',
    statusKey: 'aktif',
    lokasiKerjaKey: 'ho-jakarta',
    tagKey: 'staff',
    jenisHubunganKerjaKey: 'permanent',
    kategoriPangkatKey: 'staff',
    golonganKey: 'gol-b',
    subGolonganKey: 'sub-b1',
    lokasiSebelumnyaKey: undefined,
    scalar: {
      email_perusahaan: 'dewi.lestari@bebang.local',
      nomor_handphone: '081200000004',
      jenis_kelamin: 'Perempuan',
      tempat_lahir: 'Yogyakarta',
      tanggal_lahir: new Date('1994-03-11T00:00:00.000Z'),
      email_pribadi: 'dewi.lestari@example.com',
      agama: 'Katolik',
      golongan_darah: 'AB',
      nomor_kartu_keluarga: '3471004004004004',
      nomor_ktp: '3471004004004004',
      nomor_npwp: '04.234.567.8-901.000',
      nomor_bpjs: 'BPJS000004',
      no_nik_kk: 'NIKKK000004',
      status_pajak: 'TK/0',
      alamat_domisili: 'Jl. Cempaka No. 4, Jakarta Timur',
      kota_domisili: 'Jakarta Timur',
      provinsi_domisili: 'DKI Jakarta',
      alamat_ktp: 'Jl. Kaliurang No. 15, Yogyakarta',
      kota_ktp: 'Yogyakarta',
      provinsi_ktp: 'DI Yogyakarta',
      nomor_handphone_1: '081200000004',
      nomor_handphone_2: '081200000104',
      nomor_telepon_rumah_1: '0219000001',
      status_pernikahan: 'Belum Menikah',
      jumlah_anak: 0,
      nomor_rekening: '1000000004',
      nama_pemegang_rekening: 'Dewi Lestari',
      nama_bank: 'BCA',
      cabang_bank: 'Rawamangun',
      tanggal_masuk_group: new Date('2019-07-01T00:00:00.000Z'),
      tanggal_masuk: new Date('2019-07-01T00:00:00.000Z'),
      tanggal_permanent: new Date('2020-07-01T00:00:00.000Z'),
      no_dana_pensiun: 'DPLK000004',
      nama_kontak_darurat_1: 'Maria Lestari',
      nomor_telepon_kontak_darurat_1: '081200000501',
      hubungan_kontak_darurat_1: 'Ibu',
      alamat_kontak_darurat_1: 'Jl. Kaliurang No. 15, Yogyakarta',
      point_of_original: 'Yogyakarta',
      point_of_hire: 'Jakarta',
      ukuran_seragam_kerja: 'M',
      ukuran_sepatu_kerja: '37',
      siklus_pembayaran_gaji: 'Bulanan',
      costing: 'HR-HO-002',
      assign: 'Recruitment',
      actual: 'Recruitment',
    },
    family: undefined,
    children: [],
    siblings: [],
    educations: [
      {
        tingkat_pendidikan: 'S1',
        bidang_studi: 'Psikologi',
        nama_sekolah: 'Universitas Gadjah Mada',
        kota_sekolah: 'Yogyakarta',
        status_kelulusan: 'Lulus',
        keterangan: 'Sarjana',
      },
    ],
  },
  {
    nomor_induk_karyawan: '02-03831',
    nama_lengkap: 'Andi Saputra',
    userNik: '02-03831',
    divisiKey: 'produksi',
    departmentKey: 'produksi',
    posisiKey: 'operator-produksi',
    managerNik: '02-03829',
    atasanLangsungNik: '02-03829',
    statusKey: 'aktif',
    lokasiKerjaKey: 'plant-bekasi',
    tagKey: 'staff',
    jenisHubunganKerjaKey: 'contract',
    kategoriPangkatKey: 'staff',
    golonganKey: 'gol-a',
    subGolonganKey: 'sub-a1',
    lokasiSebelumnyaKey: undefined,
    scalar: {
      email_perusahaan: 'andi.saputra@bebang.local',
      nomor_handphone: '081200000005',
      jenis_kelamin: 'Laki-laki',
      tempat_lahir: 'Bekasi',
      tanggal_lahir: new Date('1996-01-09T00:00:00.000Z'),
      email_pribadi: 'andi.saputra@example.com',
      agama: 'Islam',
      golongan_darah: 'O',
      nomor_kartu_keluarga: '3216005005005005',
      nomor_ktp: '3216005005005005',
      nomor_npwp: '05.234.567.8-901.000',
      nomor_bpjs: 'BPJS000005',
      no_nik_kk: 'NIKKK000005',
      status_pajak: 'TK/0',
      alamat_domisili: 'Jl. Industri No. 5, Bekasi',
      kota_domisili: 'Bekasi',
      provinsi_domisili: 'Jawa Barat',
      alamat_ktp: 'Jl. Industri No. 5, Bekasi',
      kota_ktp: 'Bekasi',
      provinsi_ktp: 'Jawa Barat',
      nomor_handphone_1: '081200000005',
      nomor_handphone_2: '081200000105',
      nomor_telepon_rumah_1: '0218100001',
      status_pernikahan: 'Belum Menikah',
      jumlah_anak: 0,
      nomor_rekening: '1000000005',
      nama_pemegang_rekening: 'Andi Saputra',
      nama_bank: 'BNI',
      cabang_bank: 'Bekasi',
      tanggal_masuk_group: new Date('2022-01-10T00:00:00.000Z'),
      tanggal_masuk: new Date('2022-01-10T00:00:00.000Z'),
      tanggal_kontrak: new Date('2022-01-10T00:00:00.000Z'),
      tanggal_akhir_kontrak: new Date('2026-12-31T00:00:00.000Z'),
      no_dana_pensiun: 'DPLK000005',
      nama_kontak_darurat_1: 'Slamet Saputra',
      nomor_telepon_kontak_darurat_1: '081200000601',
      hubungan_kontak_darurat_1: 'Ayah',
      alamat_kontak_darurat_1: 'Jl. Industri No. 5, Bekasi',
      point_of_original: 'Bekasi',
      point_of_hire: 'Bekasi',
      ukuran_seragam_kerja: 'L',
      ukuran_sepatu_kerja: '42',
      siklus_pembayaran_gaji: 'Bulanan',
      costing: 'PRD-PLANT-002',
      assign: 'Line 1',
      actual: 'Operator',
    },
    family: undefined,
    children: [],
    siblings: [],
    educations: [
      {
        tingkat_pendidikan: 'SMK',
        bidang_studi: 'Teknik Mesin',
        nama_sekolah: 'SMK Negeri 1 Bekasi',
        kota_sekolah: 'Bekasi',
        status_kelulusan: 'Lulus',
        keterangan: 'Pendidikan vokasi',
      },
    ],
  },
  {
    nomor_induk_karyawan: '02-03832',
    nama_lengkap: 'Siti Rahma',
    userNik: '02-03832',
    divisiKey: 'it-development',
    departmentKey: 'it-development',
    posisiKey: 'backend-developer',
    managerNik: '02-03827',
    atasanLangsungNik: '02-03827',
    statusKey: 'aktif',
    lokasiKerjaKey: 'ho-jakarta',
    tagKey: 'staff',
    jenisHubunganKerjaKey: 'permanent',
    kategoriPangkatKey: 'supervisor',
    golonganKey: 'gol-b',
    subGolonganKey: 'sub-b1',
    lokasiSebelumnyaKey: undefined,
    scalar: {
      email_perusahaan: 'siti.rahma@bebang.local',
      nomor_handphone: '081200000006',
      jenis_kelamin: 'Perempuan',
      tempat_lahir: 'Bogor',
      tanggal_lahir: new Date('1993-02-28T00:00:00.000Z'),
      email_pribadi: 'siti.rahma@example.com',
      agama: 'Islam',
      golongan_darah: 'B',
      nomor_kartu_keluarga: '3271006006006006',
      nomor_ktp: '3271006006006006',
      nomor_npwp: '06.234.567.8-901.000',
      nomor_bpjs: 'BPJS000006',
      no_nik_kk: 'NIKKK000006',
      status_pajak: 'K/0',
      alamat_domisili: 'Jl. Pajajaran No. 16, Bogor',
      kota_domisili: 'Bogor',
      provinsi_domisili: 'Jawa Barat',
      alamat_ktp: 'Jl. Pajajaran No. 16, Bogor',
      kota_ktp: 'Bogor',
      provinsi_ktp: 'Jawa Barat',
      nomor_handphone_1: '081200000006',
      nomor_handphone_2: '081200000106',
      nomor_telepon_rumah_1: '0251800001',
      status_pernikahan: 'Menikah',
      nama_pasangan: 'Farhan Akbar',
      tanggal_menikah: new Date('2021-02-20T00:00:00.000Z'),
      pekerjaan_pasangan: 'Data Engineer',
      jumlah_anak: 1,
      nomor_rekening: '1000000006',
      nama_pemegang_rekening: 'Siti Rahma',
      nama_bank: 'CIMB Niaga',
      cabang_bank: 'Bogor',
      tanggal_masuk_group: new Date('2018-09-03T00:00:00.000Z'),
      tanggal_masuk: new Date('2018-09-03T00:00:00.000Z'),
      tanggal_permanent: new Date('2019-09-03T00:00:00.000Z'),
      no_dana_pensiun: 'DPLK000006',
      nama_kontak_darurat_1: 'Farhan Akbar',
      nomor_telepon_kontak_darurat_1: '081200000701',
      hubungan_kontak_darurat_1: 'Suami',
      alamat_kontak_darurat_1: 'Jl. Pajajaran No. 16, Bogor',
      point_of_original: 'Bogor',
      point_of_hire: 'Jakarta',
      ukuran_seragam_kerja: 'M',
      ukuran_sepatu_kerja: '38',
      siklus_pembayaran_gaji: 'Bulanan',
      costing: 'IT-HO-002',
      assign: 'Core Backend',
      actual: 'Backend Squad',
      tanggal_lahir_pasangan: new Date('1992-11-17T00:00:00.000Z'),
      pendidikan_terakhir_pasangan: 'S1 Informatika',
      keterangan_pasangan: 'Bekerja remote',
      anak_ke: 1,
      jumlah_saudara_kandung: 2,
      nama_ayah_mertua: 'Hamdan Akbar',
      tanggal_lahir_ayah_mertua: new Date('1960-08-30T00:00:00.000Z'),
      pendidikan_terakhir_ayah_mertua: 'S1',
      keterangan_ayah_mertua: 'Pensiunan ASN',
      nama_ibu_mertua: 'Wulan Akbar',
      tanggal_lahir_ibu_mertua: new Date('1963-02-14T00:00:00.000Z'),
      pendidikan_terakhir_ibu_mertua: 'SMA',
      keterangan_ibu_mertua: 'Ibu rumah tangga',
    },
    family: {
      nama_pasangan: 'Farhan Akbar',
      tanggal_lahir_pasangan: new Date('1992-11-17T00:00:00.000Z'),
      pendidikan_terakhir_pasangan: 'S1 Informatika',
      pekerjaan_pasangan: 'Data Engineer',
      jumlah_anak: 1,
      keterangan_pasangan: 'Bekerja remote',
      anak_ke: 1,
      jumlah_saudara_kandung: 2,
      nama_ayah_mertua: 'Hamdan Akbar',
      tanggal_lahir_ayah_mertua: new Date('1960-08-30T00:00:00.000Z'),
      pendidikan_terakhir_ayah_mertua: 'S1',
      keterangan_ayah_mertua: 'Pensiunan ASN',
      nama_ibu_mertua: 'Wulan Akbar',
      tanggal_lahir_ibu_mertua: new Date('1963-02-14T00:00:00.000Z'),
      pendidikan_terakhir_ibu_mertua: 'SMA',
      keterangan_ibu_mertua: 'Ibu rumah tangga',
    },
    children: [
      {
        nama_anak: 'Kirana Akbar',
        jenis_kelamin: 'Perempuan',
        tanggal_lahir: new Date('2023-05-09T00:00:00.000Z'),
        keterangan: 'Anak pertama',
      },
    ],
    siblings: [
      {
        nama_saudara_kandung: 'Rizki Rahma',
        jenis_kelamin: 'Laki-laki',
        tanggal_lahir: new Date('1995-04-04T00:00:00.000Z'),
        pendidikan_terakhir: 'S1 Sistem Informasi',
        pekerjaan: 'QA Engineer',
        keterangan: 'Adik kandung',
      },
    ],
    educations: [
      {
        tingkat_pendidikan: 'S1',
        bidang_studi: 'Ilmu Komputer',
        nama_sekolah: 'IPB University',
        kota_sekolah: 'Bogor',
        status_kelulusan: 'Lulus',
        keterangan: 'Sarjana',
      },
    ],
  },
  {
    nomor_induk_karyawan: '02-03833',
    nama_lengkap: 'Eko Prasetyo',
    userNik: '02-03833',
    divisiKey: 'it-development',
    departmentKey: 'it-development',
    posisiKey: 'frontend-developer',
    managerNik: '02-03827',
    atasanLangsungNik: '02-03827',
    statusKey: 'cuti',
    lokasiKerjaKey: 'site-cikarang',
    tagKey: 'staff',
    jenisHubunganKerjaKey: 'probation',
    kategoriPangkatKey: 'staff',
    golonganKey: 'gol-b',
    subGolonganKey: 'sub-b1',
    lokasiSebelumnyaKey: 'ho-jakarta',
    scalar: {
      email_perusahaan: 'eko.prasetyo@bebang.local',
      nomor_handphone: '081200000007',
      jenis_kelamin: 'Laki-laki',
      tempat_lahir: 'Solo',
      tanggal_lahir: new Date('1997-07-17T00:00:00.000Z'),
      email_pribadi: 'eko.prasetyo@example.com',
      agama: 'Islam',
      golongan_darah: 'A',
      nomor_kartu_keluarga: '3372007007007007',
      nomor_ktp: '3372007007007007',
      nomor_npwp: '07.234.567.8-901.000',
      nomor_bpjs: 'BPJS000007',
      no_nik_kk: 'NIKKK000007',
      status_pajak: 'TK/0',
      alamat_domisili: 'Jl. Mawar No. 17, Cikarang',
      kota_domisili: 'Bekasi',
      provinsi_domisili: 'Jawa Barat',
      alamat_ktp: 'Jl. Slamet Riyadi No. 8, Solo',
      kota_ktp: 'Surakarta',
      provinsi_ktp: 'Jawa Tengah',
      nomor_handphone_1: '081200000007',
      nomor_handphone_2: '081200000107',
      nomor_telepon_rumah_1: '0271800001',
      status_pernikahan: 'Belum Menikah',
      jumlah_anak: 0,
      nomor_rekening: '1000000007',
      nama_pemegang_rekening: 'Eko Prasetyo',
      nama_bank: 'BTN',
      cabang_bank: 'Cikarang',
      tanggal_masuk_group: new Date('2025-01-06T00:00:00.000Z'),
      tanggal_masuk: new Date('2025-01-06T00:00:00.000Z'),
      tanggal_kontrak: new Date('2025-01-06T00:00:00.000Z'),
      tanggal_akhir_kontrak: new Date('2025-07-06T00:00:00.000Z'),
      tanggal_mutasi: new Date('2025-02-15T00:00:00.000Z'),
      no_dana_pensiun: 'DPLK000007',
      nama_kontak_darurat_1: 'Slamet Prasetyo',
      nomor_telepon_kontak_darurat_1: '081200000801',
      hubungan_kontak_darurat_1: 'Ayah',
      alamat_kontak_darurat_1: 'Jl. Slamet Riyadi No. 8, Solo',
      point_of_original: 'Solo',
      point_of_hire: 'Jakarta',
      ukuran_seragam_kerja: 'L',
      ukuran_sepatu_kerja: '41',
      siklus_pembayaran_gaji: 'Bulanan',
      costing: 'IT-SITE-001',
      assign: 'Frontend Squad',
      actual: 'Employee On Leave',
    },
    family: undefined,
    children: [],
    siblings: [],
    educations: [
      {
        tingkat_pendidikan: 'S1',
        bidang_studi: 'Desain Komunikasi Visual',
        nama_sekolah: 'Universitas Sebelas Maret',
        kota_sekolah: 'Surakarta',
        status_kelulusan: 'Lulus',
        keterangan: 'Sarjana',
      },
    ],
  },
  {
    nomor_induk_karyawan: '02-03834',
    nama_lengkap: 'Maya Putri',
    userNik: '02-03834',
    divisiKey: 'produksi',
    departmentKey: 'quality-control',
    posisiKey: 'staff-qc',
    managerNik: '02-03829',
    atasanLangsungNik: '02-03829',
    statusKey: 'non-aktif',
    lokasiKerjaKey: 'plant-bekasi',
    tagKey: 'non-aktif',
    jenisHubunganKerjaKey: 'contract',
    kategoriPangkatKey: 'staff',
    golonganKey: 'gol-a',
    subGolonganKey: 'sub-a1',
    lokasiSebelumnyaKey: undefined,
    scalar: {
      email_perusahaan: 'maya.putri@bebang.local',
      nomor_handphone: '081200000008',
      jenis_kelamin: 'Perempuan',
      tempat_lahir: 'Karawang',
      tanggal_lahir: new Date('1995-12-05T00:00:00.000Z'),
      email_pribadi: 'maya.putri@example.com',
      agama: 'Islam',
      golongan_darah: 'O',
      nomor_kartu_keluarga: '3215008008008008',
      nomor_ktp: '3215008008008008',
      nomor_npwp: '08.234.567.8-901.000',
      nomor_bpjs: 'BPJS000008',
      no_nik_kk: 'NIKKK000008',
      status_pajak: 'TK/0',
      alamat_domisili: 'Jl. Melur No. 18, Karawang',
      kota_domisili: 'Karawang',
      provinsi_domisili: 'Jawa Barat',
      alamat_ktp: 'Jl. Melur No. 18, Karawang',
      kota_ktp: 'Karawang',
      provinsi_ktp: 'Jawa Barat',
      nomor_handphone_1: '081200000008',
      nomor_handphone_2: '081200000108',
      nomor_telepon_rumah_1: '0267800001',
      status_pernikahan: 'Belum Menikah',
      jumlah_anak: 0,
      nomor_rekening: '1000000008',
      nama_pemegang_rekening: 'Maya Putri',
      nama_bank: 'Mandiri',
      cabang_bank: 'Karawang',
      tanggal_masuk_group: new Date('2021-05-17T00:00:00.000Z'),
      tanggal_masuk: new Date('2021-05-17T00:00:00.000Z'),
      tanggal_kontrak: new Date('2021-05-17T00:00:00.000Z'),
      tanggal_akhir_kontrak: new Date('2024-05-17T00:00:00.000Z'),
      tanggal_berhenti: new Date('2024-06-01T00:00:00.000Z'),
      no_dana_pensiun: 'DPLK000008',
      nama_kontak_darurat_1: 'Rudi Putri',
      nomor_telepon_kontak_darurat_1: '081200000901',
      hubungan_kontak_darurat_1: 'Ayah',
      alamat_kontak_darurat_1: 'Jl. Melur No. 18, Karawang',
      point_of_original: 'Karawang',
      point_of_hire: 'Bekasi',
      ukuran_seragam_kerja: 'M',
      ukuran_sepatu_kerja: '38',
      siklus_pembayaran_gaji: 'Bulanan',
      costing: 'QC-PLANT-001',
      assign: 'QC Shift B',
      actual: 'Inactive Employee',
    },
    family: undefined,
    children: [],
    siblings: [],
    educations: [
      {
        tingkat_pendidikan: 'D3',
        bidang_studi: 'Analis Kimia',
        nama_sekolah: 'Politeknik Negeri Bandung',
        kota_sekolah: 'Bandung',
        status_kelulusan: 'Lulus',
        keterangan: 'Diploma',
      },
    ],
  },
] as const;

type SeedMasterItem<TCreateInput> = {
  key: string;
  data: TCreateInput;
};

type EmployeeFamilySeedInput = Omit<
  Prisma.EmployeeFamilyUncheckedCreateInput,
  'employee_id'
>;

type EmployeeChildSeedInput = Omit<
  Prisma.EmployeeChildUncheckedCreateInput,
  'employee_id'
>;

type EmployeeSiblingSeedInput = Omit<
  Prisma.EmployeeSiblingUncheckedCreateInput,
  'employee_id'
>;

type EmployeeEducationSeedInput = Omit<
  Prisma.EmployeeEducationUncheckedCreateInput,
  'employee_id'
>;

type EmployeeNestedCollectionInput = {
  family?: EmployeeFamilySeedInput;
  children?: EmployeeChildSeedInput[];
  siblings?: EmployeeSiblingSeedInput[];
  educations?: EmployeeEducationSeedInput[];
};

function createCodeMap<T extends { key: string }>(
  items: readonly T[],
  prefix: string,
): Record<string, string> {
  return items.reduce<Record<string, string>>((accumulator, item, index) => {
    accumulator[item.key] = generateMasterDataCode(prefix, index + 1);
    return accumulator;
  }, {});
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function generateQr(value: string): Promise<string> {
  return QRCode.toDataURL(value);
}

async function seedMasterData<
  TCreateInput extends Record<string, unknown>,
  TUpdateInput extends Record<string, unknown>,
  TResult extends { id: string; code: string },
>(options: {
  items: SeedMasterItem<TCreateInput>[];
  upsert: (args: {
    code: string;
    create: TCreateInput;
    update: TUpdateInput;
  }) => Promise<TResult>;
}): Promise<Record<string, TResult>> {
  const result: Record<string, TResult> = {};

  for (const item of options.items) {
    const record = await options.upsert({
      code: String(item.data.code),
      create: item.data,
      update: item.data as unknown as TUpdateInput,
    });

    result[item.key] = record;
  }

  return result;
}

async function seedAppModules(): Promise<void> {
  for (const module of APP_MODULES) {
    await prisma.appModule.upsert({
      where: { kode: module.kode },
      update: module,
      create: module,
    });
  }
}

async function seedUsers(
  password: string,
): Promise<Record<string, { id: string; statusKey: string }>> {
  const users: Record<string, { id: string; statusKey: string }> = {};

  for (const user of USER_SEEDS) {
    const isActive = !['cuti', 'non-aktif'].includes(user.statusKey);

    const record = await prisma.user.upsert({
      where: {
        nomor_induk_karyawan: user.nomor_induk_karyawan,
      },
      update: {
        nama_lengkap: user.nama_lengkap,
        password,
        refresh_token: null,
        is_active: isActive,
      },
      create: {
        nomor_induk_karyawan: user.nomor_induk_karyawan,
        nama_lengkap: user.nama_lengkap,
        password,
        refresh_token: null,
        is_active: isActive,
      },
      select: {
        id: true,
      },
    });

    users[user.nomor_induk_karyawan] = {
      id: record.id,
      statusKey: user.statusKey,
    };
  }

  return users;
}

async function syncEmployeeNestedData(
  employeeId: string,
  nested: EmployeeNestedCollectionInput,
): Promise<void> {
  if (nested.family) {
    await prisma.employeeFamily.upsert({
      where: { employee_id: employeeId },
      update: nested.family,
      create: {
        employee_id: employeeId,
        ...nested.family,
      },
    });
  } else {
    await prisma.employeeFamily.deleteMany({
      where: { employee_id: employeeId },
    });
  }

  await prisma.employeeChild.deleteMany({
    where: { employee_id: employeeId },
  });

  if (nested.children?.length) {
    await prisma.employeeChild.createMany({
      data: nested.children.map((child) => ({
        employee_id: employeeId,
        nama_anak: child.nama_anak,
        jenis_kelamin: child.jenis_kelamin ?? null,
        tanggal_lahir: child.tanggal_lahir ?? null,
        keterangan: child.keterangan ?? null,
      })),
    });
  }

  await prisma.employeeSibling.deleteMany({
    where: { employee_id: employeeId },
  });

  if (nested.siblings?.length) {
    await prisma.employeeSibling.createMany({
      data: nested.siblings.map((sibling) => ({
        employee_id: employeeId,
        nama_saudara_kandung: sibling.nama_saudara_kandung,
        jenis_kelamin: sibling.jenis_kelamin ?? null,
        tanggal_lahir: sibling.tanggal_lahir ?? null,
        pendidikan_terakhir: sibling.pendidikan_terakhir ?? null,
        pekerjaan: sibling.pekerjaan ?? null,
        keterangan: sibling.keterangan ?? null,
      })),
    });
  }

  await prisma.employeeEducation.deleteMany({
    where: { employee_id: employeeId },
  });

  if (nested.educations?.length) {
    await prisma.employeeEducation.createMany({
      data: nested.educations.map((education) => ({
        employee_id: employeeId,
        tingkat_pendidikan: education.tingkat_pendidikan ?? null,
        bidang_studi: education.bidang_studi ?? null,
        nama_sekolah: education.nama_sekolah ?? null,
        kota_sekolah: education.kota_sekolah ?? null,
        status_kelulusan: education.status_kelulusan ?? null,
        keterangan: education.keterangan ?? null,
      })),
    });
  }
}

async function main(): Promise<void> {
  const password = await hashPassword('password123');

  await seedAppModules();

  const divisiCodes = createCodeMap(MASTER_DATA.divisi, 'DIV');
  const departmentCodes = createCodeMap(MASTER_DATA.department, 'DEP');
  const posisiCodes = createCodeMap(MASTER_DATA.posisiJabatan, 'POS');
  const kategoriPangkatCodes = createCodeMap(MASTER_DATA.kategoriPangkat, 'KPG');
  const golonganCodes = createCodeMap(MASTER_DATA.golongan, 'GOL');
  const subGolonganCodes = createCodeMap(MASTER_DATA.subGolongan, 'SGO');
  const jenisHubunganKerjaCodes = createCodeMap(
    MASTER_DATA.jenisHubunganKerja,
    'JHK',
  );
  const tagCodes = createCodeMap(MASTER_DATA.tag, 'TAG');
  const lokasiKerjaCodes = createCodeMap(MASTER_DATA.lokasiKerja, 'LKR');
  const statusKaryawanCodes = createCodeMap(MASTER_DATA.statusKaryawan, 'STK');

  const divisiMap = await seedMasterData({
    items: MASTER_DATA.divisi.map((item) => ({
      key: item.key,
      data: {
        code: divisiCodes[item.key],
        nama: item.nama,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.divisi.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const departmentMap = await seedMasterData({
    items: MASTER_DATA.department.map((item) => ({
      key: item.key,
      data: {
        code: departmentCodes[item.key],
        nama: item.nama,
        divisi_id: divisiMap[item.divisiKey].id,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.department.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const posisiMap = await seedMasterData({
    items: MASTER_DATA.posisiJabatan.map((item) => ({
      key: item.key,
      data: {
        code: posisiCodes[item.key],
        nama: item.nama,
        department_id: departmentMap[item.departmentKey].id,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.posisiJabatan.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const kategoriPangkatMap = await seedMasterData({
    items: MASTER_DATA.kategoriPangkat.map((item) => ({
      key: item.key,
      data: {
        code: kategoriPangkatCodes[item.key],
        nama: item.nama,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.kategoriPangkat.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const golonganMap = await seedMasterData({
    items: MASTER_DATA.golongan.map((item) => ({
      key: item.key,
      data: {
        code: golonganCodes[item.key],
        nama: item.nama,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.golongan.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const subGolonganMap = await seedMasterData({
    items: MASTER_DATA.subGolongan.map((item) => ({
      key: item.key,
      data: {
        code: subGolonganCodes[item.key],
        nama: item.nama,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.subGolongan.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const jenisHubunganKerjaMap = await seedMasterData({
    items: MASTER_DATA.jenisHubunganKerja.map((item) => ({
      key: item.key,
      data: {
        code: jenisHubunganKerjaCodes[item.key],
        nama: item.nama,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.jenisHubunganKerja.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const tagMap = await seedMasterData({
    items: MASTER_DATA.tag.map((item) => ({
      key: item.key,
      data: {
        code: tagCodes[item.key],
        nama: item.nama,
        warna_tag: item.warna_tag,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.tag.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const lokasiKerjaMap = await seedMasterData({
    items: MASTER_DATA.lokasiKerja.map((item) => ({
      key: item.key,
      data: {
        code: lokasiKerjaCodes[item.key],
        nama: item.nama,
        alamat: item.alamat,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.lokasiKerja.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const statusKaryawanMap = await seedMasterData({
    items: MASTER_DATA.statusKaryawan.map((item) => ({
      key: item.key,
      data: {
        code: statusKaryawanCodes[item.key],
        nama: item.nama,
        keterangan: item.keterangan,
        status: item.status,
      },
    })),
    upsert: ({ code, create, update }) =>
      prisma.statusKaryawan.upsert({
        where: { code },
        update,
        create,
        select: { id: true, code: true },
      }),
  });

  const userMap = await seedUsers(password);
  const employeeMap: Record<string, { id: string }> = {};

  for (const employeeSeed of EMPLOYEE_SEEDS) {
    const qrCode = await generateQr(employeeSeed.nomor_induk_karyawan);
    const statusRecord = statusKaryawanMap[employeeSeed.statusKey];
    const scalarData: Prisma.EmployeeUncheckedCreateInput = {
      user_id: userMap[employeeSeed.userNik].id,
      nomor_induk_karyawan: employeeSeed.nomor_induk_karyawan,
      nama_lengkap: employeeSeed.nama_lengkap,
      qr_code: qrCode,
      divisi_id: divisiMap[employeeSeed.divisiKey].id,
      department_id: departmentMap[employeeSeed.departmentKey].id,
      posisi_jabatan_id: posisiMap[employeeSeed.posisiKey].id,
      status_karyawan_id: statusRecord.id,
      lokasi_kerja_id: lokasiKerjaMap[employeeSeed.lokasiKerjaKey].id,
      tag_id: employeeSeed.tagKey ? tagMap[employeeSeed.tagKey].id : null,
      jenis_hubungan_kerja_id: employeeSeed.jenisHubunganKerjaKey
        ? jenisHubunganKerjaMap[employeeSeed.jenisHubunganKerjaKey].id
        : null,
      kategori_pangkat_id: employeeSeed.kategoriPangkatKey
        ? kategoriPangkatMap[employeeSeed.kategoriPangkatKey].id
        : null,
      golongan_id: employeeSeed.golonganKey
        ? golonganMap[employeeSeed.golonganKey].id
        : null,
      sub_golongan_id: employeeSeed.subGolonganKey
        ? subGolonganMap[employeeSeed.subGolonganKey].id
        : null,
      lokasi_sebelumnya_id: employeeSeed.lokasiSebelumnyaKey
        ? lokasiKerjaMap[employeeSeed.lokasiSebelumnyaKey].id
        : null,
      manager_id: null,
      atasan_langsung_id: null,
      is_deleted: false,
      ...employeeSeed.scalar,
    };

    const employee = await prisma.employee.upsert({
      where: {
        nomor_induk_karyawan: employeeSeed.nomor_induk_karyawan,
      },
      update: scalarData,
      create: scalarData,
      select: {
        id: true,
      },
    });

    employeeMap[employeeSeed.nomor_induk_karyawan] = employee;

    await syncEmployeeNestedData(employee.id, {
      family: employeeSeed.family
        ? {
            ...employeeSeed.family,
          }
        : undefined,
      children: employeeSeed.children.map((child) => ({
        ...child,
      })),
      siblings: employeeSeed.siblings.map((sibling) => ({
        ...sibling,
      })),
      educations: employeeSeed.educations.map((education) => ({
        ...education,
      })),
    });
  }

  for (const employeeSeed of EMPLOYEE_SEEDS) {
    await prisma.employee.update({
      where: {
        nomor_induk_karyawan: employeeSeed.nomor_induk_karyawan,
      },
      data: {
        manager_id: employeeSeed.managerNik
          ? employeeMap[employeeSeed.managerNik].id
          : null,
        atasan_langsung_id: employeeSeed.atasanLangsungNik
          ? employeeMap[employeeSeed.atasanLangsungNik].id
          : null,
      },
    });
  }

  await prisma.department.update({
    where: { id: departmentMap.hr.id },
    data: { manager_id: employeeMap['02-03828'].id },
  });

  await prisma.department.update({
    where: { id: departmentMap.produksi.id },
    data: { manager_id: employeeMap['02-03829'].id },
  });

  await prisma.department.update({
    where: { id: departmentMap['it-development'].id },
    data: { manager_id: employeeMap['02-03827'].id },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
