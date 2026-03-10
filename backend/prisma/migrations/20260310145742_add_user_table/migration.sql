-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nomor_induk_karyawan" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_nomor_induk_karyawan_key" ON "users"("nomor_induk_karyawan");
