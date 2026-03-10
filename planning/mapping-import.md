Saya sudah mengecek **3 sumber data**:

1. **Template Excel Import** (`template-import-fix.xlsx`)
2. **Mapping awal di sheet Excel**
3. **Dokumen Markdown Manajemen Karyawan** yang Anda upload 

Lalu saya **memfilter field yang benar-benar masuk ke modul Manajemen Karyawan** dan **mengabaikan field Master Data** seperti yang Anda minta.

---

# 1. Field yang DIABAIKAN (Master Data)

Field berikut **tidak perlu diimport langsung**, karena nilainya berasal dari menu master data:

* PANGKAT KATEGORI
* GOLONGAN
* SUB GOLONGAN
* JENIS HUBUNGAN KERJA
* DIVISI
* DEPARTMENT
* POSISI JABATAN
* TAG
* STATUS KARYAWAN
* LOKASI KERJA

Saat import nanti cukup gunakan **nama referensi**, lalu sistem melakukan **lookup ke master data**.

---

# 2. Mapping Field Import → Field Manajemen Karyawan

## Identitas Karyawan

| Header Excel         | Field Sistem           |
| -------------------- | ---------------------- |
| NOMIR INDUK KARYAWAN | `nomor_induk_karyawan` |
| NAMA LENGKAP         | `nama_lengkap`         |
| JENIS KELAMIN        | `jenis_kelamin`        |
| TEMPAT LAHIR         | `tempat_lahir`         |
| TANGGAL LAHIR        | `tanggal_lahir`        |

---

# 3. Mapping Informasi HR

| Header Excel          | Field Sistem            |
| --------------------- | ----------------------- |
| POSISI JABATAN        | `posisi_jabatan`        |
| JENIS HUBUNGAN KERJA  | `jenis_hubungan_kerja`  |
| TANGGAL JOIN GROUP    | `tanggal_masuk_group`   |
| TANGGAL MASUK         | `tanggal_masuk`         |
| TANGGAL AWAL KONTRAK  | `tanggal_kontrak`       |
| TANGGAL AKHIR KONTRAK | `tanggal_akhir_kontrak` |
| TANGGAL TETAP         | `tanggal_permanent`     |
| TANGGAL KELUAR        | `tanggal_berhenti`      |

---

# 4. Mapping Pangkat & Golongan

| Header Excel       | Field Sistem           |
| ------------------ | ---------------------- |
| PANGKAT KATEGORI   | `kategori_pangkat`     |
| GOLONGAN           | `golongan_pangkat`     |
| SUB GOLONGAN       | `sub_golongan_pangkat` |
| NOMOR DANA PENSIUN | `no_dana_pensiun`      |

---

# 5. Mapping Kontak dan Alamat

| Header Excel          | Field Sistem            |
| --------------------- | ----------------------- |
| NOMOR HP 1            | `nomor_handphone_1`     |
| NOMOR JP 2            | `nomor_handphone_2`     |
| NOMOR TELEPON RUMAH 1 | `nomor_telepon_rumah_1` |
| NOMOR TELEPON RUMAH 2 | `nomor_telepon_rumah_2` |
| ALAMAT DOMISILI       | `alamat_domisili`       |
| KOTA DOMISILI         | `kota_domisili`         |
| PROPINSI DOMISILI     | `provinsi_domisili`     |
| ALAMAT KTP            | `alamat_ktp`            |

---

# 6. Mapping Identifikasi

| Header Excel   | Field Sistem     |
| -------------- | ---------------- |
| AGAMA          | `agama`          |
| GOLONGAN DARAH | `golongan_darah` |
| NOMOR KTP      | `nomor_ktp`      |
| NOMOR NPWP     | `nomor_npwp`     |
| NOMOR BPJS-TK  | `nomor_bpjs`     |

---

# 7. Mapping Bank

| Header Excel          | Field Sistem             |
| --------------------- | ------------------------ |
| NOMOR REKENING        | `nomor_rekening`         |
| NAMA PEMILIK REKENING | `nama_pemegang_rekening` |

---

# 8. Mapping Status Pernikahan

| Header Excel           | Field Sistem             |
| ---------------------- | ------------------------ |
| STATUS PERNIKAHAN      | `status_pernikahan`      |
| TANGGAL MENIKAH        | `tanggal_menikah`        |
| TANGGAL CERAI          | `tanggal_cerai`          |
| TANGGAL WAFAT PASANGAN | `tanggal_wafat_pasangan` |

---

# 9. Mapping Pasangan

| Header Excel                 | Field Sistem                   |
| ---------------------------- | ------------------------------ |
| NAMA PASANGAN NIKAH          | `nama_pasangan`                |
| TANGGAL LAHIR PASANGAN       | `tanggal_lahir_pasangan`       |
| PENDIDIKAN TERAKHIR PASANGAN | `pendidikan_terakhir_pasangan` |
| PEKERJAAN PASANGAN           | `pekerjaan_pasangan`           |
| KETERANGAN PASANGAN          | `keterangan_pasangan`          |

---

# 10. Mapping Anak

| Header Excel         | Field Sistem           |
| -------------------- | ---------------------- |
| NAMA ANAK 1          | `nama_anak_1`          |
| JENIS KELAMIN ANAK 1 | `jenis_kelamin_anak_1` |
| TANGGAL LAHIR ANAK 1 | `tanggal_lahir_anak_1` |
| KETERANGAN ANAK 1    | `keterangan_anak_1`    |

(dan seterusnya untuk anak 2,3,4)

---

# 11. Mapping Education

| Header Excel          | Field Sistem         |
| --------------------- | -------------------- |
| PENDIDIKAN TERAKHIR   | `tingkat_pendidikan` |
| JURUSAN PENDIDIKAN    | `bidang_studi`       |
| NAMA SEKOLAH          | `nama_sekolah`       |
| KOTA SEKOLAH          | `kota_sekolah`       |
| STATUS PENDIDIKAN     | `status_kelulusan`   |
| KETERANGAN PENDIDIKAN | `keterangan`         |

---

# 12. Mapping Costing

| Header Excel   | Field Sistem |
| -------------- | ------------ |
| LOKASI COSTING | `costing`    |
| ACTUAL         | `actual`     |
| ASSIGN         | `assign`     |

---

# 13. Temuan Masalah di Template Excel ⚠️

Ada beberapa **typo pada header**:

| Header Excel         | Seharusnya           |
| -------------------- | -------------------- |
| NOMIR INDUK KARYAWAN | NOMOR INDUK KARYAWAN |
| NOMOR JP 2           | NOMOR HP 2           |
| PROPINSI             | PROVINSI             |
| TANGGAL LAHUR        | TANGGAL LAHIR        |
| JENIS KELELAMIN      | JENIS KELAMIN        |

Disarankan diperbaiki agar **import parser tidak error**.

---

# 14. Rekomendasi Struktur Import untuk Sistem Anda

Agar modul HR **Bebang Information System** lebih stabil:

**Gunakan 3 tahap import**

### 1️⃣ Validasi

* cek NIK unik
* cek format tanggal
* cek referensi master data

### 2️⃣ Mapping

Excel → field database

### 3️⃣ Insert

* tabel employee
* tabel employee_family
* tabel employee_education

---


