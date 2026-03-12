# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Scope repo
- [`package.json`](package.json) root hanya untuk orkestrasi `dev`; command kerja utama dijalankan dari subdir [`backend`](backend) atau [`frontend`](frontend).

## Command penting
- Backend dari [`backend`](backend): `npm run build`, `npm run lint`, `npm run start:dev`, `npm run prisma:generate`, `npm run prisma:migrate:dev`, `npm run prisma:migrate:deploy`, `npm run seed`.
- Frontend dari [`frontend`](frontend): `npm run build`, `npm run dev`, `npm run preview`.
- Tidak ada script test; verifikasi utama ada di build/lint subdir.

## Gotcha domain/arsitektur
- Master data HR memakai abstraksi CRUD generik [`BaseMasterDataService`](backend/src/modules/hr/master-data/base-master-data.service.ts); operasi delete = toggle status `Aktif/Tidak Aktif`, bukan hard delete.
- Karyawan memakai soft delete `is_deleted`; list/detail selalu asumsi non-deleted.
- Validasi relasi karyawan wajib konsisten: department milik divisi, posisi milik department, manager harus karyawan aktif dengan posisi mengandung `head`, semua referensi master data harus `Aktif`.
- Import Excel selalu 3 tahap: upload preview -> validate simpan session -> execute via `sessionId`; session import disimpan di memory `Map`, hilang saat restart server.
- Import lookup master data/karyawan berbasis nama aktif, bukan code/id; normalisasi header dan tanggal cukup toleran.
- Foto karyawan disimpan di [`backend/uploads/foto-karyawan`](backend/uploads/foto-karyawan); DB hanya simpan relative path, frontend membentuk URL dari base API + `/uploads/...`.
- QR code disimpan sebagai data URL base64 di DB, bukan file.
- Auth frontend mendukung storage `localStorage`/`sessionStorage`; refresh token memakai queue anti request paralel.
- HR master data frontend dibangun lewat pola [`useMasterData`](frontend/src/modules/hr/hooks/useMasterData.ts); menu master data hardcoded di [`shared.tsx`](frontend/src/modules/hr/master-data/shared.tsx), sedangkan modul aplikasi utama justru data-driven dari endpoint `/modules`.
- Form create karyawan frontend hanya kirim subset field inti; edit/detail/import mendukung field lebih luas.
- NIK wajib format `xx-xxxxx`.

## Style dan source of truth
- Backend strict TypeScript + global `ValidationPipe` whitelist/forbid; banyak field/domain berbahasa Indonesia snake_case.
- Frontend memakai Ant Design + Tailwind; terminologi UI campur Indonesia/Inggris; pola select searchable biasanya `optionFilterProp: "label"`.
- Source of truth domain utama: [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) dan [`backend/prisma/seed.ts`](backend/prisma/seed.ts). Ringkasan endpoint/akun/import ada di [`README.md`](README.md).
