# AGENTS.md

## Saat membaca proyek
- Jangan simpulkan command dari root; cek [`backend/package.json`](backend/package.json) dan [`frontend/package.json`](frontend/package.json) karena root [`package.json`](package.json) hanya orkestrasi `dev`.
- Untuk aturan domain HR, mulai dari [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) dan [`backend/prisma/seed.ts`](backend/prisma/seed.ts); keduanya lebih representatif daripada UI.
- Untuk perilaku import, baca [`backend/src/modules/hr/import/import.service.ts`](backend/src/modules/hr/import/import.service.ts), [`import.controller.ts`](backend/src/modules/hr/import/import.controller.ts), dan [`import-mapping.constants.ts`](backend/src/modules/hr/import/import-mapping.constants.ts).
- Untuk master data frontend, rute/menu HR ada di [`frontend/src/modules/hr/master-data/shared.tsx`](frontend/src/modules/hr/master-data/shared.tsx); jangan samakan dengan modul aplikasi utama yang data-driven dari [`frontend/src/modules/app/useModules.ts`](frontend/src/modules/app/useModules.ts).
- Untuk payload karyawan, bandingkan create vs edit/detail/import; [`KaryawanCreatePage`](frontend/src/modules/hr/karyawan/KaryawanCreatePage.tsx) tidak mewakili seluruh field domain.
- Untuk kontrak validasi backend, cek [`backend/src/main.ts`](backend/src/main.ts) karena global `ValidationPipe` memakai whitelist/forbid.
- Ringkasan endpoint, akun seed, dan alur import ada di [`README.md`](README.md).
