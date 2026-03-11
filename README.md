# Bebang Sistem Informasi

Aplikasi ini adalah monorepo internal yang terdiri dari backend NestJS dan frontend React untuk kebutuhan administrasi perusahaan. Fokus implementasi saat ini ada pada autentikasi berbasis NIK, modul aplikasi, dan modul Human Resources untuk pengelolaan master data, data karyawan, detail karyawan, foto karyawan, QR code, serta import data karyawan berbasis Excel.

## Gambaran Aplikasi

Repositori ini dibagi menjadi dua aplikasi utama:

- `backend/`: REST API berbasis NestJS, Prisma, dan PostgreSQL
- `frontend/`: aplikasi web berbasis React, Vite, TypeScript, Ant Design, dan Tailwind CSS

Secara umum alur penggunaan aplikasi adalah sebagai berikut:

1. Pengguna login menggunakan NIK dan password
2. Frontend mengambil daftar modul aplikasi yang tersedia untuk user
3. Pengguna masuk ke modul HR
4. Pengguna mengelola master data, daftar karyawan, detail karyawan, atau import Excel

## Fitur Utama

### 1. Autentikasi berbasis NIK
- Login menggunakan nomor induk karyawan dengan format seperti `02-03827`
- Endpoint autentikasi menyediakan login, refresh token, profile, dan logout
- Akses endpoint modul dan HR dilindungi JWT

### 2. Modul aplikasi
- Backend menyediakan daftar modul aplikasi melalui endpoint modul
- Seed sudah menyiapkan beberapa modul, termasuk modul HR yang aktif
- Frontend menampilkan area utama aplikasi setelah login

### 3. Modul Human Resources
Fitur HR yang sudah tersedia meliputi:

- dashboard HR
- master data:
  - divisi
  - department
  - posisi jabatan
  - kategori pangkat
  - golongan
  - sub golongan
  - jenis hubungan kerja
  - tag
  - lokasi kerja
  - status karyawan
- daftar karyawan
- tambah karyawan
- detail karyawan
- upload foto karyawan
- generate QR code karyawan
- import data karyawan dari file Excel

### 4. Import Excel data karyawan
Flow import dibuat bertahap agar lebih aman:

1. download template Excel
2. upload file `.xlsx`
3. preview data hasil upload
4. validasi per baris dan per kolom
5. execute import untuk baris valid
6. review hasil sukses dan gagal

## Struktur Proyek Singkat

```text
.
├─ backend/
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  ├─ migrations/
│  │  └─ seed.ts
│  ├─ src/
│  │  ├─ modules/
│  │  │  ├─ auth/
│  │  │  ├─ app-module/
│  │  │  └─ hr/
│  │  ├─ config/
│  │  └─ common/
│  └─ assets/
├─ frontend/
│  ├─ src/
│  │  ├─ modules/
│  │  │  ├─ auth/
│  │  │  ├─ app/
│  │  │  └─ hr/
│  │  ├─ routes/
│  │  ├─ components/
│  │  └─ lib/
│  └─ index.html
└─ README.md
```

## Kebutuhan Sistem

Minimal siapkan lingkungan berikut:

- Node.js 20 atau lebih baru
- npm 10 atau lebih baru
- PostgreSQL 14 atau lebih baru
- akses terminal untuk menjalankan backend dan frontend secara terpisah

## Instalasi

### 1. Clone repository
```bash
git clone <url-repository>
cd gpt-bis
```

### 2. Install dependency backend
```bash
cd backend
npm install
```

### 3. Install dependency frontend
```bash
cd ../frontend
npm install
```

## Konfigurasi Environment Singkat

Backend menggunakan file environment di `backend/.env` dengan acuan dari `backend/.env.example`.

Contoh isi penting environment:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:123456789@localhost:5432/gpt-bis
JWT_SECRET=changeme
JWT_EXPIRATION=1d
JWT_REFRESH_SECRET=changeme-refresh
JWT_REFRESH_EXPIRATION=7d
UPLOAD_DIR=uploads
```

Keterangan singkat:

- `PORT`: port backend
- `API_PREFIX`: prefix seluruh endpoint API, default `api`
- `FRONTEND_URL`: origin frontend untuk CORS
- `DATABASE_URL`: koneksi PostgreSQL untuk Prisma
- `UPLOAD_DIR`: folder penyimpanan file upload, termasuk foto karyawan

Catatan:

- frontend berjalan default di `http://localhost:5173`
- backend berjalan default di `http://localhost:3000`
- dengan konfigurasi default di atas, base API menjadi `http://localhost:3000/api`

## Menjalankan Database, Migration, dan Seed Prisma

Pastikan PostgreSQL sudah aktif dan database yang dirujuk oleh `DATABASE_URL` sudah tersedia.

### 1. Generate Prisma Client
```bash
cd backend
npm run prisma:generate
```

### 2. Jalankan migration untuk development
```bash
npm run prisma:migrate:dev
```

Alternatif untuk environment deployment:

```bash
npm run prisma:migrate:deploy
```

### 3. Jalankan seed data
Konfigurasi seed sudah tersedia di `backend/package.json`, sehingga seed dapat dijalankan dengan perintah berikut:

```bash
npx prisma db seed
```

Seed akan mengisi:

- modul aplikasi
- master data HR
- akun user
- data karyawan contoh
- relasi organisasi dasar seperti manager dan atasan langsung

## Menjalankan Aplikasi

### Menjalankan backend
```bash
cd backend
npm run start:dev
```

Backend aktif di:

- root check: `http://localhost:3000/`
- API: `http://localhost:3000/api`

### Menjalankan frontend
Buka terminal lain:

```bash
cd frontend
npm run dev
```

Frontend aktif di:

- `http://localhost:5173`

## Akun Demo atau Default dari Seed

Seed data menyiapkan akun contoh berikut:

- NIK: `02-03827`
- Password: `password123`
- Nama: `Administrator Sistem`

Akun ini dapat dipakai untuk login awal setelah migration dan seed selesai.

## Ringkasan Endpoint dan Flow Utama

Karena backend memakai prefix `api`, endpoint efektif akan diawali `/api`.

### Autentikasi
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/profile`
- `POST /api/auth/logout`

Flow ringkas:

1. login dengan NIK dan password
2. simpan access token dan refresh token di frontend
3. gunakan token untuk mengakses modul dan fitur HR
4. refresh token saat diperlukan

### Modul aplikasi
- `GET /api/modules`

Digunakan frontend untuk mengambil daftar modul aplikasi yang tersedia setelah user terautentikasi.

### HR karyawan
- `GET /api/hr/karyawan`
- `GET /api/hr/karyawan/options`
- `GET /api/hr/karyawan/:id`
- `POST /api/hr/karyawan`
- `PATCH /api/hr/karyawan/:id`
- `DELETE /api/hr/karyawan/:id`
- `POST /api/hr/karyawan/:id/foto`
- `GET /api/hr/karyawan/:id/qrcode`

Flow utama:

1. buka daftar karyawan
2. tambah data baru atau buka detail karyawan
3. ubah data personal, keluarga, pendidikan, dan HR sesuai kebutuhan
4. upload foto karyawan bila diperlukan
5. generate atau akses QR code karyawan

### HR import Excel
- `GET /api/hr/import/template`
- `POST /api/hr/import/upload`
- `POST /api/hr/import/validate`
- `POST /api/hr/import/execute`

Flow utama:

1. download template
2. isi file Excel sesuai struktur template
3. upload untuk preview
4. validasi file
5. execute import menggunakan session hasil validasi
6. tinjau hasil import per baris

## Catatan Penting Upload dan Import

### Upload foto karyawan
- endpoint foto menerima field file bernama `foto`
- ukuran file maksimal 5 MB
- format file yang diterima: `jpeg`, `jpg`, `png`, `webp`
- file upload disajikan statis melalui folder `UPLOAD_DIR`

### Import Excel
- file yang didukung adalah `.xlsx`
- ukuran file import maksimal 10 MB
- proses import dibagi menjadi preview, validasi, dan execute
- validasi dapat menghasilkan error per row dan per cell
- hasil execute menampilkan ringkasan sukses dan gagal
- template import sudah tersedia di `backend/assets/template-import-fix.xlsx`

Saran penggunaan import:

- selalu download template terbaru sebelum menyiapkan file
- lakukan validasi sampai seluruh row yang diinginkan berstatus valid
- cek detail error pada baris merah sebelum execute
- gunakan hasil execute untuk mengetahui baris yang masih perlu diperbaiki

## Rute Frontend yang Relevan

Rute utama yang sudah tersedia di frontend antara lain:

- `/login`
- `/`
- `/hr`
- `/hr/import`
- `/hr/karyawan`
- `/hr/karyawan/tambah`
- `/hr/karyawan/:id`
- `/hr/master-data/divisi`
- `/hr/master-data/department`
- `/hr/master-data/posisi-jabatan`
- `/hr/master-data/kategori-pangkat`
- `/hr/master-data/golongan`
- `/hr/master-data/sub-golongan`
- `/hr/master-data/jenis-hubungan-kerja`
- `/hr/master-data/tag`
- `/hr/master-data/lokasi-kerja`
- `/hr/master-data/status-karyawan`

## Catatan Pengembangan

- monorepo ini belum menggunakan orkestrator workspace khusus; backend dan frontend dijalankan terpisah
- backend menggunakan Prisma migration yang sudah tersimpan di `backend/prisma/migrations/`
- seed cukup kaya untuk kebutuhan development awal karena sudah mengisi master data, user, dan data karyawan contoh
- folder upload backend sudah disiapkan untuk penyimpanan foto karyawan

## Ringkasan Cepat Setup

Jika ingin cepat menjalankan proyek dari nol, urutan amannya adalah:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npx prisma db seed
npm run start:dev
```

Di terminal lain:

```bash
cd frontend
npm install
npm run dev
```

Lalu login menggunakan:

- NIK `02-03827`
- password `password123`
