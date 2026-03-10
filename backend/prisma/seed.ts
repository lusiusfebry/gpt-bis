import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: {
      nomor_induk_karyawan: '02-03827',
    },
    update: {
      nama_lengkap: 'Administrator Sistem',
      password,
      refresh_token: null,
      is_active: true,
    },
    create: {
      nomor_induk_karyawan: '02-03827',
      nama_lengkap: 'Administrator Sistem',
      password,
      refresh_token: null,
      is_active: true,
    },
  });

  await prisma.appModule.upsert({
    where: { kode: 'hr' },
    update: {
      nama: 'Human Resources',
      deskripsi:
        'Kelola data karyawan, struktur organisasi, dan administrasi SDM',
      ikon: 'TeamOutlined',
      path: '/hr',
      is_aktif: true,
      urutan: 1,
    },
    create: {
      kode: 'hr',
      nama: 'Human Resources',
      deskripsi:
        'Kelola data karyawan, struktur organisasi, dan administrasi SDM',
      ikon: 'TeamOutlined',
      path: '/hr',
      is_aktif: true,
      urutan: 1,
    },
  });

  await prisma.appModule.upsert({
    where: { kode: 'inventory' },
    update: {
      nama: 'Inventory',
      deskripsi: 'Kelola inventaris dan aset perusahaan',
      ikon: 'InboxOutlined',
      path: '/inventory',
      is_aktif: false,
      urutan: 2,
    },
    create: {
      kode: 'inventory',
      nama: 'Inventory',
      deskripsi: 'Kelola inventaris dan aset perusahaan',
      ikon: 'InboxOutlined',
      path: '/inventory',
      is_aktif: false,
      urutan: 2,
    },
  });

  await prisma.appModule.upsert({
    where: { kode: 'mess' },
    update: {
      nama: 'Mess Management',
      deskripsi: 'Kelola fasilitas mess dan penghunian karyawan',
      ikon: 'HomeOutlined',
      path: '/mess',
      is_aktif: false,
      urutan: 3,
    },
    create: {
      kode: 'mess',
      nama: 'Mess Management',
      deskripsi: 'Kelola fasilitas mess dan penghunian karyawan',
      ikon: 'HomeOutlined',
      path: '/mess',
      is_aktif: false,
      urutan: 3,
    },
  });

  await prisma.appModule.upsert({
    where: { kode: 'building' },
    update: {
      nama: 'Building Management',
      deskripsi: 'Kelola gedung, fasilitas, dan pemeliharaan bangunan',
      ikon: 'BankOutlined',
      path: '/building',
      is_aktif: false,
      urutan: 4,
    },
    create: {
      kode: 'building',
      nama: 'Building Management',
      deskripsi: 'Kelola gedung, fasilitas, dan pemeliharaan bangunan',
      ikon: 'BankOutlined',
      path: '/building',
      is_aktif: false,
      urutan: 4,
    },
  });

  await prisma.appModule.upsert({
    where: { kode: 'uarm' },
    update: {
      nama: 'User Access Right Management',
      deskripsi: 'Kelola hak akses pengguna dan keamanan sistem',
      ikon: 'SafetyOutlined',
      path: '/uarm',
      is_aktif: false,
      urutan: 5,
    },
    create: {
      kode: 'uarm',
      nama: 'User Access Right Management',
      deskripsi: 'Kelola hak akses pengguna dan keamanan sistem',
      ikon: 'SafetyOutlined',
      path: '/uarm',
      is_aktif: false,
      urutan: 5,
    },
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
