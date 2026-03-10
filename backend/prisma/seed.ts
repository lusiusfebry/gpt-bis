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
    },
    create: {
      nomor_induk_karyawan: '02-03827',
      nama_lengkap: 'Administrator Sistem',
      password,
      refresh_token: null,
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
