-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "nomor_induk_karyawan" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "foto_karyawan" TEXT,
    "qr_code" TEXT,
    "divisi_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "manager_id" TEXT,
    "atasan_langsung_id" TEXT,
    "posisi_jabatan_id" TEXT NOT NULL,
    "email_perusahaan" TEXT,
    "nomor_handphone" TEXT,
    "status_karyawan_id" TEXT NOT NULL,
    "lokasi_kerja_id" TEXT NOT NULL,
    "tag_id" TEXT,
    "jenis_kelamin" TEXT,
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "email_pribadi" TEXT,
    "agama" TEXT,
    "golongan_darah" TEXT,
    "nomor_kartu_keluarga" TEXT,
    "nomor_ktp" TEXT,
    "nomor_npwp" TEXT,
    "nomor_bpjs" TEXT,
    "no_nik_kk" TEXT,
    "status_pajak" TEXT,
    "alamat_domisili" TEXT,
    "kota_domisili" TEXT,
    "provinsi_domisili" TEXT,
    "alamat_ktp" TEXT,
    "kota_ktp" TEXT,
    "provinsi_ktp" TEXT,
    "nomor_handphone_1" TEXT,
    "nomor_handphone_2" TEXT,
    "nomor_telepon_rumah_1" TEXT,
    "nomor_telepon_rumah_2" TEXT,
    "status_pernikahan" TEXT,
    "nama_pasangan" TEXT,
    "tanggal_menikah" TIMESTAMP(3),
    "tanggal_cerai" TIMESTAMP(3),
    "tanggal_wafat_pasangan" TIMESTAMP(3),
    "pekerjaan_pasangan" TEXT,
    "jumlah_anak" INTEGER DEFAULT 0,
    "nomor_rekening" TEXT,
    "nama_pemegang_rekening" TEXT,
    "nama_bank" TEXT,
    "cabang_bank" TEXT,
    "jenis_hubungan_kerja_id" TEXT,
    "tanggal_masuk_group" TIMESTAMP(3),
    "tanggal_masuk" TIMESTAMP(3),
    "tanggal_permanent" TIMESTAMP(3),
    "tanggal_kontrak" TIMESTAMP(3),
    "tanggal_akhir_kontrak" TIMESTAMP(3),
    "tanggal_berhenti" TIMESTAMP(3),
    "kategori_pangkat_id" TEXT,
    "golongan_id" TEXT,
    "sub_golongan_id" TEXT,
    "no_dana_pensiun" TEXT,
    "nama_kontak_darurat_1" TEXT,
    "nomor_telepon_kontak_darurat_1" TEXT,
    "hubungan_kontak_darurat_1" TEXT,
    "alamat_kontak_darurat_1" TEXT,
    "nama_kontak_darurat_2" TEXT,
    "nomor_telepon_kontak_darurat_2" TEXT,
    "hubungan_kontak_darurat_2" TEXT,
    "alamat_kontak_darurat_2" TEXT,
    "point_of_original" TEXT,
    "point_of_hire" TEXT,
    "ukuran_seragam_kerja" TEXT,
    "ukuran_sepatu_kerja" TEXT,
    "lokasi_sebelumnya_id" TEXT,
    "tanggal_mutasi" TIMESTAMP(3),
    "siklus_pembayaran_gaji" TEXT,
    "costing" TEXT,
    "assign" TEXT,
    "actual" TEXT,
    "tanggal_lahir_pasangan" TIMESTAMP(3),
    "pendidikan_terakhir_pasangan" TEXT,
    "keterangan_pasangan" TEXT,
    "anak_ke" INTEGER,
    "jumlah_saudara_kandung" INTEGER,
    "nama_ayah_mertua" TEXT,
    "tanggal_lahir_ayah_mertua" TIMESTAMP(3),
    "pendidikan_terakhir_ayah_mertua" TEXT,
    "keterangan_ayah_mertua" TEXT,
    "nama_ibu_mertua" TEXT,
    "tanggal_lahir_ibu_mertua" TIMESTAMP(3),
    "pendidikan_terakhir_ibu_mertua" TEXT,
    "keterangan_ibu_mertua" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_families" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "nama_pasangan" TEXT,
    "tanggal_lahir_pasangan" TIMESTAMP(3),
    "pendidikan_terakhir_pasangan" TEXT,
    "pekerjaan_pasangan" TEXT,
    "jumlah_anak" INTEGER DEFAULT 0,
    "keterangan_pasangan" TEXT,
    "anak_ke" INTEGER,
    "jumlah_saudara_kandung" INTEGER,
    "nama_ayah_mertua" TEXT,
    "tanggal_lahir_ayah_mertua" TIMESTAMP(3),
    "pendidikan_terakhir_ayah_mertua" TEXT,
    "keterangan_ayah_mertua" TEXT,
    "nama_ibu_mertua" TEXT,
    "tanggal_lahir_ibu_mertua" TIMESTAMP(3),
    "pendidikan_terakhir_ibu_mertua" TEXT,
    "keterangan_ibu_mertua" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_children" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "nama_anak" TEXT NOT NULL,
    "jenis_kelamin" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_siblings" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "nama_saudara_kandung" TEXT NOT NULL,
    "jenis_kelamin" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "pendidikan_terakhir" TEXT,
    "pekerjaan" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_siblings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_educations" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "tingkat_pendidikan" TEXT,
    "bidang_studi" TEXT,
    "nama_sekolah" TEXT,
    "kota_sekolah" TEXT,
    "status_kelulusan" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_educations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_nomor_induk_karyawan_key" ON "employees"("nomor_induk_karyawan");

-- CreateIndex
CREATE INDEX "employees_divisi_id_idx" ON "employees"("divisi_id");

-- CreateIndex
CREATE INDEX "employees_department_id_idx" ON "employees"("department_id");

-- CreateIndex
CREATE INDEX "employees_manager_id_idx" ON "employees"("manager_id");

-- CreateIndex
CREATE INDEX "employees_atasan_langsung_id_idx" ON "employees"("atasan_langsung_id");

-- CreateIndex
CREATE INDEX "employees_posisi_jabatan_id_idx" ON "employees"("posisi_jabatan_id");

-- CreateIndex
CREATE INDEX "employees_status_karyawan_id_idx" ON "employees"("status_karyawan_id");

-- CreateIndex
CREATE INDEX "employees_lokasi_kerja_id_idx" ON "employees"("lokasi_kerja_id");

-- CreateIndex
CREATE INDEX "employees_tag_id_idx" ON "employees"("tag_id");

-- CreateIndex
CREATE INDEX "employees_jenis_hubungan_kerja_id_idx" ON "employees"("jenis_hubungan_kerja_id");

-- CreateIndex
CREATE INDEX "employees_kategori_pangkat_id_idx" ON "employees"("kategori_pangkat_id");

-- CreateIndex
CREATE INDEX "employees_golongan_id_idx" ON "employees"("golongan_id");

-- CreateIndex
CREATE INDEX "employees_sub_golongan_id_idx" ON "employees"("sub_golongan_id");

-- CreateIndex
CREATE INDEX "employees_lokasi_sebelumnya_id_idx" ON "employees"("lokasi_sebelumnya_id");

-- CreateIndex
CREATE INDEX "employees_is_deleted_nama_lengkap_idx" ON "employees"("is_deleted", "nama_lengkap");

-- CreateIndex
CREATE INDEX "employees_is_deleted_nomor_induk_karyawan_idx" ON "employees"("is_deleted", "nomor_induk_karyawan");

-- CreateIndex
CREATE UNIQUE INDEX "employee_families_employee_id_key" ON "employee_families"("employee_id");

-- CreateIndex
CREATE INDEX "employee_families_employee_id_idx" ON "employee_families"("employee_id");

-- CreateIndex
CREATE INDEX "employee_children_employee_id_idx" ON "employee_children"("employee_id");

-- CreateIndex
CREATE INDEX "employee_siblings_employee_id_idx" ON "employee_siblings"("employee_id");

-- CreateIndex
CREATE INDEX "employee_educations_employee_id_idx" ON "employee_educations"("employee_id");

-- CreateIndex
CREATE INDEX "departments_manager_id_idx" ON "departments"("manager_id");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_divisi_id_fkey" FOREIGN KEY ("divisi_id") REFERENCES "divisi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_atasan_langsung_id_fkey" FOREIGN KEY ("atasan_langsung_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_posisi_jabatan_id_fkey" FOREIGN KEY ("posisi_jabatan_id") REFERENCES "posisi_jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_status_karyawan_id_fkey" FOREIGN KEY ("status_karyawan_id") REFERENCES "status_karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_lokasi_kerja_id_fkey" FOREIGN KEY ("lokasi_kerja_id") REFERENCES "lokasi_kerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_jenis_hubungan_kerja_id_fkey" FOREIGN KEY ("jenis_hubungan_kerja_id") REFERENCES "jenis_hubungan_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_kategori_pangkat_id_fkey" FOREIGN KEY ("kategori_pangkat_id") REFERENCES "kategori_pangkat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_golongan_id_fkey" FOREIGN KEY ("golongan_id") REFERENCES "golongan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_sub_golongan_id_fkey" FOREIGN KEY ("sub_golongan_id") REFERENCES "sub_golongan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_lokasi_sebelumnya_id_fkey" FOREIGN KEY ("lokasi_sebelumnya_id") REFERENCES "lokasi_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_families" ADD CONSTRAINT "employee_families_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_children" ADD CONSTRAINT "employee_children_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_siblings" ADD CONSTRAINT "employee_siblings_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_educations" ADD CONSTRAINT "employee_educations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
