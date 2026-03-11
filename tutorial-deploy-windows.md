# Tutorial Deploy Aplikasi di Windows

Dokumen ini menjelaskan langkah instalasi lokal sampai deployment aplikasi monorepo di Windows untuk kombinasi:

- backend NestJS + Prisma + PostgreSQL di `backend/`
- frontend React + Vite + TypeScript di `frontend/`
- reverse proxy dan static file serving menggunakan Nginx di Windows

Panduan ini ditujukan untuk developer atau operator yang ingin menjalankan aplikasi secara stabil di mesin Windows, baik untuk kebutuhan local staging maupun server internal.

---

## 1. Tujuan deployment

Target akhir deployment:

- PostgreSQL berjalan sebagai database utama
- backend NestJS berjalan sebagai proses Node.js yang stabil di Windows
- frontend dibuild menjadi file statis lalu dilayani oleh Nginx
- request ke frontend dilayani dari Nginx
- request API ke path `/api` diteruskan Nginx ke backend
- request file upload ke path `/uploads` juga diteruskan ke backend

Contoh topologi sederhana:

```text
Browser User
   |
   v
Nginx Windows :80 atau :8080
   |--- /            -> frontend static build
   |--- /api         -> proxy ke backend NestJS
   |--- /uploads     -> proxy ke backend NestJS
   |
   v
Backend NestJS :3000
   |
   v
PostgreSQL :5432
```

---

## 2. Arsitektur singkat proyek

Struktur utama yang relevan:

- `backend/` untuk API NestJS
- `backend/prisma/` untuk schema, migration, dan seed Prisma
- `frontend/` untuk aplikasi React + Vite
- backend default berjalan di port `3000`
- frontend development default berjalan di port `5173`
- backend menggunakan prefix API `api`

Berdasarkan konfigurasi proyek saat ini:

- backend default memakai `PORT=3000`
- prefix API default adalah `api`
- origin frontend default backend adalah `http://localhost:5173`
- Vite di mode development memproxy `/api` dan `/uploads` ke backend

---

## 3. Prasyarat software di Windows

Siapkan software berikut:

1. **Git**
   - untuk clone repository

2. **Node.js LTS**
   - disarankan Node.js 20 LTS atau versi LTS yang kompatibel
   - npm sudah ikut terpasang

3. **PostgreSQL**
   - disarankan PostgreSQL 15 atau 16
   - pastikan service PostgreSQL aktif
   - catat user, password, host, dan port database

4. **Nginx untuk Windows**
   - digunakan untuk melayani build frontend dan reverse proxy ke backend

5. **Opsional: NSSM atau PM2**
   - **NSSM** cocok bila ingin mendaftarkan backend sebagai Windows Service
   - **PM2** cocok bila ingin manajemen proses Node.js yang mudah dengan restart otomatis

6. **Opsional: editor dan terminal**
   - VS Code
   - Command Prompt, PowerShell, atau Windows Terminal

---

## 4. Rekomendasi direktori deployment

Contoh struktur direktori di Windows:

```text
C:\apps\gpt-bis\
  backend\
  frontend\
  nginx\
  logs\
```

Atau bila repository tetap utuh:

```text
C:\apps\gpt-bis\
  backend\
  frontend\
  tutorial-deploy-windows.md
```

Gunakan path tanpa spasi bila memungkinkan agar konfigurasi service dan Nginx lebih sederhana.

---

## 5. Clone project dan install dependency

### 5.1 Clone repository

```bash
git clone <URL-REPOSITORY> gpt-bis
cd gpt-bis
```

### 5.2 Install dependency backend

```bash
cd backend
npm install
```

### 5.3 Install dependency frontend

Buka terminal baru atau kembali ke root project, lalu:

```bash
cd frontend
npm install
```

Catatan:

- Repository ini menggunakan pemisahan dependency per folder aplikasi, jadi instalasi dilakukan di `backend/` dan `frontend/` masing-masing.
- Pastikan tidak ada error dependency sebelum lanjut ke tahap database dan build.

---

## 6. Setup PostgreSQL dari nol

Pada tahap ini, targetnya adalah membuat database kosong yang akan dipakai Prisma.

### 6.1 Pastikan service PostgreSQL aktif

Cek lewat:

- `services.msc`
- atau PostgreSQL service manager
- atau jalankan `psql` untuk memastikan server merespons

### 6.2 Login ke PostgreSQL

Contoh memakai user default `postgres`:

```bash
psql -U postgres -h localhost -p 5432
```

Bila `psql` tidak dikenali, tambahkan folder `bin` PostgreSQL ke `PATH`, misalnya:

```text
C:\Program Files\PostgreSQL\16\bin
```

### 6.3 Buat database baru

Contoh membuat database sesuai contoh project:

```sql
CREATE DATABASE gpt_bis;
```

Bila ingin nama database mengikuti contoh file environment project, Anda juga bisa memakai:

```sql
CREATE DATABASE "gpt-bis";
```

Namun untuk memudahkan operasional, nama database dengan underscore seperti `gpt_bis` biasanya lebih aman dan umum dipakai.

### 6.4 Opsional: buat user khusus aplikasi

Disarankan untuk environment non-development.

```sql
CREATE USER gptbis_user WITH PASSWORD 'GantiPasswordKuat!';
GRANT ALL PRIVILEGES ON DATABASE gpt_bis TO gptbis_user;
```

Jika memakai PostgreSQL dengan kebijakan schema yang ketat, setelah database dibuat Anda juga dapat mengatur hak schema setelah koneksi ke database target.

Contoh:

```sql
\c gpt_bis;
GRANT ALL ON SCHEMA public TO gptbis_user;
```

---

## 7. Penyesuaian `DATABASE_URL` dan environment backend

Project menyediakan contoh environment di `backend/.env.example`.

Isi penting default saat ini antara lain:

- `PORT=3000`
- `API_PREFIX=api`
- `FRONTEND_URL=http://localhost:5173`
- `DATABASE_URL=postgresql://postgres:123456789@localhost:5432/gpt-bis`

### 7.1 Buat file environment backend

Di folder `backend/`, copy file contoh menjadi file environment aktif:

```bash
copy .env.example .env
```

Jika memakai PowerShell:

```powershell
Copy-Item .env.example .env
```

### 7.2 Contoh isi `DATABASE_URL`

Contoh bila memakai user `postgres` lokal:

```env
DATABASE_URL=postgresql://postgres:password-postgres@localhost:5432/gpt_bis
```

Contoh bila memakai user aplikasi khusus:

```env
DATABASE_URL=postgresql://gptbis_user:GantiPasswordKuat!@localhost:5432/gpt_bis
```

Format umum:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/NAMA_DATABASE
```

### 7.3 Contoh file `.env` backend untuk development lokal

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:password-postgres@localhost:5432/gpt_bis
JWT_SECRET=ganti-dengan-rahasia-yang-kuat
JWT_EXPIRATION=1d
JWT_REFRESH_SECRET=ganti-dengan-rahasia-refresh-yang-kuat
JWT_REFRESH_EXPIRATION=7d
UPLOAD_DIR=uploads
```

### 7.4 Contoh file `.env` backend untuk production di Windows

Jika frontend nanti dilayani dari domain atau host Nginx, origin frontend backend harus mengikuti alamat frontend tersebut.

Contoh:

```env
NODE_ENV=production
PORT=3000
API_PREFIX=api
FRONTEND_URL=http://192.168.1.10
DATABASE_URL=postgresql://gptbis_user:GantiPasswordKuat!@localhost:5432/gpt_bis
JWT_SECRET=ganti-dengan-rahasia-yang-sangat-kuat
JWT_EXPIRATION=1d
JWT_REFRESH_SECRET=ganti-dengan-rahasia-refresh-yang-sangat-kuat
JWT_REFRESH_EXPIRATION=7d
UPLOAD_DIR=uploads
```

Jika memakai domain internal atau domain publik, ganti `FRONTEND_URL` menjadi URL final frontend, misalnya:

```env
FRONTEND_URL=http://hr.company.local
```

### 7.5 Catatan port frontend dan backend

- Backend default: `http://localhost:3000`
- Prefix API backend: `http://localhost:3000/api`
- Frontend dev Vite default: `http://localhost:5173`
- Pada production, frontend sebaiknya diakses melalui Nginx, misalnya `http://localhost` atau `http://nama-host`

---

## 8. Prisma generate, migration, dan seed

Setelah file environment backend siap dan database sudah dibuat, jalankan langkah Prisma dari folder `backend/`.

### 8.1 Generate Prisma Client

```bash
npm run prisma:generate
```

### 8.2 Jalankan migration

#### Opsi development

Gunakan saat setup lokal developer:

```bash
npm run prisma:migrate:dev
```

Perintah ini akan:

- membaca `DATABASE_URL`
- membuat atau menyesuaikan struktur database
- menghasilkan Prisma Client bila diperlukan

#### Opsi production

Setelah migration sudah tersedia di repository, gunakan:

```bash
npm run prisma:migrate:deploy
```

Gunakan perintah ini di server deployment karena lebih aman untuk environment production.

### 8.3 Jalankan seed data

Karena project sudah memiliki seed di `backend/prisma/seed.ts`, jalankan:

```bash
npx prisma db seed
```

Seed ini akan mengisi data awal aplikasi, termasuk akun demo untuk login.

---

## 9. Kredensial login default hasil seed

Setelah seed berhasil, akun demo default yang bisa digunakan adalah:

- **NIK / username**: `02-03827`
- **Password**: `password123`

Saran operasional:

- gunakan akun ini hanya untuk verifikasi awal
- setelah deployment berhasil, pertimbangkan mengganti password melalui mekanisme aplikasi atau menyiapkan akun admin produksi terpisah

---

## 10. Menjalankan aplikasi di mode development

Mode ini cocok untuk pengembangan dan verifikasi lokal sebelum production.

### 10.1 Jalankan backend development

Dari folder `backend/`:

```bash
npm run start:dev
```

Backend akan berjalan di port sesuai `PORT`, default `3000`.

### 10.2 Jalankan frontend development

Dari folder `frontend/`:

```bash
npm run dev
```

Frontend default berjalan di `http://localhost:5173`.

Pada mode development, file `frontend/vite.config.ts` sudah memproxy request berikut ke backend:

- `/api`
- `/uploads`

Dengan demikian, saat frontend development aktif, akses API dari browser dapat tetap mengarah secara konsisten melalui origin frontend dev.

### 10.3 Verifikasi development

- buka `http://localhost:5173`
- login menggunakan akun seed
- pastikan request login mengarah ke backend tanpa error CORS
- pastikan endpoint API dapat diakses melalui prefix `/api`

---

## 11. Build frontend dan backend untuk production

Lakukan build setelah environment dan database tervalidasi.

### 11.1 Build backend

Dari folder `backend/`:

```bash
npm run build
```

Hasil build backend akan berada di folder `backend/dist/`.

Untuk menjalankan hasil build secara manual:

```bash
npm run start:prod
```

atau setara dengan:

```bash
node dist/main
```

### 11.2 Build frontend

Dari folder `frontend/`:

```bash
npm run build
```

Hasil build frontend akan berada di folder `frontend/dist/`.

Folder `frontend/dist/` inilah yang nantinya akan dilayani oleh Nginx sebagai static site.

### 11.3 Catatan penting frontend production

Di production, frontend tidak perlu lagi server Vite. Yang dibutuhkan hanya file hasil build statis.

Karena API akan diproxy oleh Nginx melalui path `/api`, frontend cukup diakses dari host Nginx yang sama. Ini menyederhanakan routing dan mengurangi masalah CORS.

---

## 12. Menjalankan backend sebagai proses stabil di Windows

Backend production sebaiknya tidak dijalankan manual dari terminal biasa. Gunakan process manager atau Windows Service.

Ada dua opsi yang umum direkomendasikan.

### Opsi A: PM2

PM2 cocok bila ingin restart otomatis, logging, dan manajemen proses Node.js yang praktis.

#### 12.1 Install PM2

Jalankan sekali secara global:

```bash
npm install -g pm2
```

#### 12.2 Jalankan backend dengan PM2

Masuk ke folder `backend/`, lalu jalankan:

```bash
pm2 start dist/main.js --name gpt-bis-backend
```

Atau bila ingin memastikan memakai Node langsung:

```bash
pm2 start node --name gpt-bis-backend -- dist/main.js
```

#### 12.3 Simpan konfigurasi proses

```bash
pm2 save
```

Catatan:

- PM2 di Windows dapat dipakai untuk menjaga proses tetap hidup, tetapi integrasi startup Windows tidak selalu sesederhana Linux.
- Untuk server Windows murni yang mengandalkan Service Control Manager, NSSM sering lebih stabil dan mudah dipahami operator Windows.

### Opsi B: NSSM

NSSM sangat cocok bila ingin backend tampil sebagai Windows Service yang dikelola lewat `services.msc`.

#### 12.4 Install NSSM

- unduh NSSM
- ekstrak ke folder misalnya `C:\tools\nssm\`

#### 12.5 Siapkan command backend

Pastikan langkah berikut sudah dilakukan:

- `backend/.env` sudah benar
- backend sudah dibuild
- dependency backend sudah terpasang

#### 12.6 Daftarkan service backend

Contoh command:

```bash
C:\tools\nssm\win64\nssm.exe install gpt-bis-backend
```

Pada jendela konfigurasi NSSM, isi contoh berikut:

- **Application path**: `C:\Program Files\nodejs\node.exe`
- **Startup directory**: `C:\apps\gpt-bis\backend`
- **Arguments**: `dist\main.js`

Di tab environment, bila diperlukan, Anda bisa memastikan service membaca file environment dari working directory yang benar.

Di tab log, arahkan output ke file log misalnya:

- `C:\apps\gpt-bis\logs\backend-stdout.log`
- `C:\apps\gpt-bis\logs\backend-stderr.log`

Setelah itu jalankan service:

```bash
net start gpt-bis-backend
```

### Rekomendasi pilihan

- Gunakan **NSSM** bila targetnya server Windows yang dikelola seperti service standar Windows
- Gunakan **PM2** bila tim lebih familiar dengan ekosistem Node.js dan butuh manajemen proses cepat

---

## 13. Konfigurasi Nginx di Windows

Nginx akan melakukan dua tugas utama:

1. melayani file statis hasil build frontend
2. meneruskan `/api` dan `/uploads` ke backend NestJS

### 13.1 Siapkan Nginx

Misalnya Nginx diekstrak ke:

```text
C:\nginx\
```

Struktur yang umum:

```text
C:\nginx\
  conf\
  html\
  logs\
  nginx.exe
```

### 13.2 Salin hasil build frontend

Setelah `npm run build` di `frontend/`, copy isi `frontend/dist/` ke lokasi yang akan dilayani Nginx.

Contoh target:

```text
C:\nginx\html\gpt-bis\
```

Pastikan file seperti `index.html` ada di folder tersebut.

### 13.3 Konsep routing yang dibutuhkan

- `/` mengarah ke frontend static build
- `/api/` diproxy ke `http://127.0.0.1:3000/api/`
- `/uploads/` diproxy ke `http://127.0.0.1:3000/uploads/`
- SPA fallback diarahkan ke `index.html`

---

## 14. Contoh konfigurasi Nginx untuk Windows

Edit file konfigurasi, misalnya `C:\nginx\conf\nginx.conf` atau letakkan server block di file include terpisah jika Anda mengatur Nginx dengan pola modular.

Contoh konfigurasi minimal yang relevan:

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        root   C:/nginx/html/gpt-bis;
        index  index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://127.0.0.1:3000/api/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /uploads/ {
            proxy_pass http://127.0.0.1:3000/uploads/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 14.1 Penjelasan singkat konfigurasi

- `root` menunjuk ke folder build frontend
- `try_files $uri $uri/ /index.html;` penting untuk SPA React agar refresh route tidak menghasilkan 404
- blok `location /api/` meneruskan request API ke backend
- blok `location /uploads/` meneruskan file upload atau file statis backend ke backend

### 14.2 Jika memakai port selain 80

Misalnya ingin memakai port `8080`:

```nginx
listen 8080;
```

Maka akses frontend menjadi:

```text
http://localhost:8080
```

Jika memakai port lain untuk frontend final, sesuaikan juga nilai `FRONTEND_URL` di `backend/.env` agar konfigurasi CORS backend tetap benar.

Contoh:

```env
FRONTEND_URL=http://localhost:8080
```

### 14.3 Uji dan jalankan ulang Nginx

Dari folder Nginx:

```bash
nginx -t
```

Jika valid, reload:

```bash
nginx -s reload
```

Jika Nginx belum berjalan:

```bash
start nginx
```

Catatan untuk Windows:

- jalankan terminal sebagai Administrator bila diperlukan
- pastikan tidak ada aplikasi lain yang sudah memakai port `80` atau `8080`

---

## 15. Membuka firewall dan port dasar

Pada mesin Windows Server atau workstation yang diakses dari jaringan lain, buka port yang memang diperlukan.

Port yang umum:

- `80` untuk HTTP Nginx
- `443` bila nanti memakai HTTPS
- `3000` tidak perlu diekspos ke publik bila hanya diakses internal oleh Nginx pada mesin yang sama
- `5432` PostgreSQL sebaiknya tidak dibuka ke publik kecuali memang ada kebutuhan khusus dan sudah diamankan

### 15.1 Contoh membuka port HTTP di Windows Firewall

Jalankan Command Prompt sebagai Administrator:

```bash
netsh advfirewall firewall add rule name="Nginx HTTP" dir=in action=allow protocol=TCP localport=80
```

Contoh untuk port `8080`:

```bash
netsh advfirewall firewall add rule name="Nginx 8080" dir=in action=allow protocol=TCP localport=8080
```

Jika suatu saat memakai HTTPS:

```bash
netsh advfirewall firewall add rule name="Nginx HTTPS" dir=in action=allow protocol=TCP localport=443
```

Rekomendasi keamanan:

- expose hanya port Nginx ke user
- backend dan database sebaiknya tetap hanya bisa diakses lokal atau jaringan terbatas

---

## 16. Urutan deployment production yang direkomendasikan

Urutan praktis yang aman:

1. clone repository
2. install dependency backend dan frontend
3. install dan siapkan PostgreSQL
4. buat database dan user database
5. buat `backend/.env`
6. jalankan `npm run prisma:generate` di `backend/`
7. jalankan `npm run prisma:migrate:deploy` di `backend/`
8. jalankan `npx prisma db seed` di `backend/`
9. build backend dengan `npm run build`
10. build frontend dengan `npm run build`
11. copy hasil `frontend/dist/` ke folder static Nginx
12. jalankan backend dengan NSSM atau PM2
13. konfigurasi Nginx untuk static frontend dan proxy `/api`
14. test akses frontend, login, API, dan file upload
15. buka firewall yang diperlukan

---

## 17. Verifikasi pasca deploy

Setelah semua aktif, lakukan verifikasi berikut.

### 17.1 Verifikasi backend lokal

Akses endpoint API dasar melalui browser atau tools seperti Postman:

```text
http://127.0.0.1:3000/api
```

Jika tidak ada endpoint root yang merespons, minimal pastikan proses backend hidup dan log tidak menunjukkan error startup.

### 17.2 Verifikasi frontend dari Nginx

Buka:

```text
http://localhost
```

atau jika memakai port lain:

```text
http://localhost:8080
```

Pastikan halaman login tampil.

### 17.3 Verifikasi login

Gunakan akun seed:

- NIK: `02-03827`
- password: `password123`

Pastikan login berhasil dan aplikasi dapat memuat data setelah autentikasi.

### 17.4 Verifikasi network browser

Buka DevTools browser lalu cek:

- request ke `/api/...` berhasil dan tidak terkena error CORS
- asset frontend seperti JS dan CSS termuat normal
- route React bisa direfresh tanpa 404

### 17.5 Verifikasi service backend

Jika memakai NSSM:

- cek di `services.msc`
- pastikan service `gpt-bis-backend` statusnya running

Jika memakai PM2:

```bash
pm2 list
```

Pastikan proses backend statusnya online.

### 17.6 Verifikasi database

Pastikan migration sudah masuk dan tabel terbuat.

Bisa dicek dengan:

- `npx prisma studio`
- pgAdmin
- query SQL langsung ke PostgreSQL

---

## 18. Troubleshooting singkat

### Masalah 1: `psql` tidak dikenali

Penyebab umum:

- folder binary PostgreSQL belum masuk `PATH`

Solusi:

- tambahkan folder `bin` PostgreSQL ke environment variable `PATH`
- buka terminal baru lalu ulangi command

### Masalah 2: Prisma gagal konek ke database

Penyebab umum:

- `DATABASE_URL` salah
- password database salah
- service PostgreSQL belum aktif
- nama database belum dibuat

Solusi:

- cek ulang `backend/.env`
- uji koneksi database dengan `psql`
- pastikan host, port, user, password, dan nama database benar

### Masalah 3: CORS error saat login atau akses API

Penyebab umum:

- nilai `FRONTEND_URL` di backend tidak sama dengan origin frontend yang diakses user

Solusi:

- sesuaikan `FRONTEND_URL` di `backend/.env`
- restart backend setelah mengubah environment

Contoh:

- jika frontend diakses dari `http://localhost`, maka set `FRONTEND_URL=http://localhost`
- jika frontend diakses dari `http://localhost:8080`, maka set `FRONTEND_URL=http://localhost:8080`

### Masalah 4: Refresh halaman React menghasilkan 404

Penyebab umum:

- Nginx belum memakai fallback SPA

Solusi:

Pastikan blok frontend menggunakan:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Masalah 5: API 502 Bad Gateway dari Nginx

Penyebab umum:

- backend belum berjalan
- backend berjalan di port yang berbeda
- `proxy_pass` salah

Solusi:

- cek proses backend
- cek log backend
- cek nilai `proxy_pass` di Nginx
- pastikan backend merespons di `127.0.0.1:3000`

### Masalah 6: Upload atau file gambar tidak tampil

Penyebab umum:

- path `/uploads` belum diproxy Nginx
- folder upload backend tidak tersedia atau tidak punya izin tulis

Solusi:

- pastikan ada blok `location /uploads/` pada Nginx
- pastikan `UPLOAD_DIR=uploads` sesuai kebutuhan
- pastikan service backend memiliki permission ke folder upload

### Masalah 7: Perubahan frontend tidak terlihat

Penyebab umum:

- folder build lama belum terganti
- browser cache
- hasil `frontend/dist/` belum disalin ulang ke folder Nginx

Solusi:

- jalankan build frontend lagi
- salin ulang isi `frontend/dist/`
- lakukan hard refresh browser

### Masalah 8: Service backend langsung berhenti

Penyebab umum:

- dependency belum terpasang
- backend belum dibuild
- file `.env` tidak terbaca
- path service salah

Solusi:

- pastikan `npm install` sudah dilakukan di `backend/`
- pastikan `dist/main.js` ada
- pastikan startup directory service mengarah ke folder `backend/`
- cek file log service

---

## 19. Rekomendasi operasional tambahan

Untuk deployment Windows yang lebih rapi, disarankan:

- gunakan user database khusus aplikasi
- ganti semua secret JWT default
- simpan log backend dan Nginx di folder terpisah
- backup database PostgreSQL secara berkala
- batasi akses port database
- dokumentasikan path instalasi final di server
- lakukan redeploy frontend setiap ada perubahan UI
- jalankan migration deploy setiap ada perubahan schema Prisma yang baru

---

## 20. Ringkasan command penting

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate:dev
npx prisma db seed
npm run start:dev
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
```

### Production Prisma

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate:deploy
npx prisma db seed
```

### PM2

```bash
cd backend
pm2 start dist/main.js --name gpt-bis-backend
pm2 save
pm2 list
```

### Nginx

```bash
nginx -t
nginx -s reload
```

---

## 21. Checklist deployment singkat

Gunakan checklist ini saat implementasi:

- Git, Node.js, PostgreSQL, dan Nginx sudah terpasang
- repository sudah di-clone
- dependency `backend/` dan `frontend/` sudah terpasang
- database PostgreSQL sudah dibuat
- `backend/.env` sudah disesuaikan
- Prisma generate dan migration berhasil
- seed berhasil dijalankan
- akun default bisa dipakai login
- backend production berjalan stabil via NSSM atau PM2
- frontend build sudah disalin ke folder Nginx
- Nginx berhasil serve frontend
- `/api` dan `/uploads` berhasil diproxy ke backend
- firewall port sudah sesuai kebutuhan
- verifikasi login dan akses halaman berhasil

---

Dokumen ini cukup untuk alur instalasi lokal, staging internal, dan deployment Windows sederhana berbasis Nginx reverse proxy. Untuk production yang lebih matang, tahap berikutnya biasanya mencakup HTTPS, domain resmi, backup terjadwal, monitoring log, dan rotasi secret.