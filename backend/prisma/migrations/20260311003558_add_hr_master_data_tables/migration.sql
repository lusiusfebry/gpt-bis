-- CreateTable
CREATE TABLE "kategori_pangkat" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pangkat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "golongan" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_golongan" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_hubungan_kerja" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jenis_hubungan_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "warna_tag" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kategori_pangkat_code_key" ON "kategori_pangkat"("code");

-- CreateIndex
CREATE UNIQUE INDEX "golongan_code_key" ON "golongan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sub_golongan_code_key" ON "sub_golongan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_hubungan_kerja_code_key" ON "jenis_hubungan_kerja"("code");

-- CreateIndex
CREATE UNIQUE INDEX "tags_code_key" ON "tags"("code");

-- AddForeignKey
UPDATE "departments"
SET "manager_id" = NULL
WHERE "manager_id" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "employees"
    WHERE "employees"."id" = "departments"."manager_id"
  );

CREATE INDEX "departments_manager_id_idx" ON "departments"("manager_id");

ALTER TABLE "departments" ADD CONSTRAINT "departments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

