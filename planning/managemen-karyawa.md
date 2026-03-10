# Modul: Human Resources
## Manajemen Karyawan

### Profil Karyawan

#### Bagian Head
- **foto_karyawan**: Unggah File (Gambar)
- **nama_lengkap**: Teks (Wajib diisi)
- **nomor_induk_karyawan**: Teks (Wajib diisi)
- **divisi**: Pilihan (dari master divisi yang aktif)
- **department**: Pilihan (dari master department yang aktif)
- **manager**: Pilihan (dari data karyawan aktif dengan posisi jabatan "head")
- **atasan_langsung**: Pilihan (dari data karyawan yang aktif)
- **posisi_jabatan**: Pilihan (dari master posisi jabatan yang aktif)
- **email_perusahaan**: Teks (Email, tidak wajib)
- **nomor_handphone**: Teks
- **status_karyawan**: Pilihan (dari master status karyawan)
- **lokasi_kerja**: Pilihan (dari master lokasi kerja)
- **tag**: Pilihan (dari master tag)

---

## Detail Profil (Tabs)

### Tab: Personal Information

#### Group: Biodata Karyawan
- **nama_lengkap**
- **jenis_kelamin**
- **tempat_lahir**
- **tanggal_lahir**
- **email_pribadi**

#### Group: Identifikasi
- **agama**
- **golongan_darah**
- **nomor_kartu_keluarga**
- **nomor_ktp**
- **nomor_npwp**
- **nomor_bpjs**
- **no_nik_kk**
- **status_pajak**

#### Group: Alamat Domisili
- **alamat_domisili**
- **kota_domisili**
- **provinsi_domisili**

#### Group: Alamat KTP
- **alamat_ktp**
- **kota_ktp**
- **provinsi_ktp**

#### Group: Informasi Kontak
- **nomor_handphone_1**
- **nomor_handphone_2**
- **nomor_telepon_rumah_1**
- **nomor_telepon_rumah_2**

#### Group: Status Pernikahan dan Anak
- **status_pernikahan**
- **nama_pasangan**
- **tanggal_menikah**
- **tanggal_cerai**
- **tanggal_wafat_pasangan**
- **pekerjaan_pasangan**
- **jumlah_anak**

#### Group: Rekening Bank
- **nomor_rekening**
- **nama_pemegang_rekening**
- **nama_bank**
- **cabang_bank**

---

### Tab: Informasi HR

#### Group: Kepegawaian
- **nomor_induk_karyawan**
- **posisi_jabatan**
- **divisi**
- **department**
- **email_perusahaan**
- **manager**
- **atasan_langsung**

#### Group: Kontrak
- **jenis_hubungan_kerja**
- **tanggal_masuk_group**
- **tanggal_masuk**
- **tanggal_permanent**
- **tanggal_kontrak**
- **tanggal_akhir_kontrak**
- **tanggal_berhenti**

#### Group: Education
- **tingkat_pendidikan**
- **bidang_studi**
- **nama_sekolah**
- **kota_sekolah**
- **status_kelulusan**
- **keterangan**

#### Group: Pangkat dan Golongan
- **kategori_pangkat**
- **golongan_pangkat**
- **sub_golongan_pangkat**
- **no_dana_pensiun**

#### Group: Kontak Darurat
- **nama_kontak_darurat_1**
- **nomor_telepon_kontak_darurat_1**
- **hubungan_kontak_darurat_1**
- **alamat_kontak_darurat_1**
- **nama_kontak_darurat_2**
- **nomor_telepon_kontak_darurat_2**
- **hubungan_kontak_darurat_2**
- **alamat_kontak_darurat_2**

#### Group: POO / POH
- **point_of_original**
- **point_of_hire**

#### Group: Seragam dan Sepatu Kerja
- **ukuran_seragam_kerja**
- **ukuran_sepatu_kerja**

#### Group: Pergerakan Karyawan
- **lokasi_sebelumnya**
- **tanggal_mutasi**

#### Group: Costing
- **siklus_pembayaran_gaji**
- **costing**
- **assign**
- **actual**

---

### Tab: Informasi Keluarga

#### Group: Pasangan
- **nama_pasangan**
- **tanggal_lahir_pasangan**
- **pendidikan_terakhir_pasangan**
- **pekerjaan_pasangan**
- **keterangan_pasangan**

#### Group: Anak (Repeatable)
- **nama_anak**
- **jenis_kelamin_anak**
- **tanggal_lahir_anak**
- **keterangan_anak**

#### Group: Saudara Kandung
- **anak_ke**
- **jumlah_saudara_kandung**

#### Group: Identitas Saudara Kandung (Repeatable max 5)
- **nama_saudara_kandung**
- **jenis_kelamin**
- **tanggal_lahir**
- **pendidikan_terakhir**
- **pekerjaan**
- **keterangan**

#### Group: Orang Tua Mertua
- **nama_ayah_mertua**
- **tanggal_lahir_ayah_mertua**
- **pendidikan_terakhir_ayah_mertua**
- **keterangan_ayah_mertua**

- **nama_ibu_mertua**
- **tanggal_lahir_ibu_mertua**
- **pendidikan_terakhir_ibu_mertua**
- **keterangan_ibu_mertua**

---

## Catatan
- Field pilihan harus memiliki **fitur pencarian (searchable dropdown)**.
- Sistem harus mendukung **QR Code otomatis dari `nomor_induk_karyawan`**.