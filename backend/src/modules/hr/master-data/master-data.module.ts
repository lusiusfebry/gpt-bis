import { Module } from '@nestjs/common';

import { DepartmentModule } from './department/department.module';
import { DivisiModule } from './divisi/divisi.module';
import { GolonganModule } from './golongan/golongan.module';
import { JenisHubunganKerjaModule } from './jenis-hubungan-kerja/jenis-hubungan-kerja.module';
import { KategoriPangkatModule } from './kategori-pangkat/kategori-pangkat.module';
import { LokasiKerjaModule } from './lokasi-kerja/lokasi-kerja.module';
import { PosisiJabatanModule } from './posisi-jabatan/posisi-jabatan.module';
import { StatusKaryawanModule } from './status-karyawan/status-karyawan.module';
import { SubGolonganModule } from './sub-golongan/sub-golongan.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    DivisiModule,
    DepartmentModule,
    PosisiJabatanModule,
    KategoriPangkatModule,
    GolonganModule,
    SubGolonganModule,
    JenisHubunganKerjaModule,
    TagModule,
    LokasiKerjaModule,
    StatusKaryawanModule,
  ],
})
export class MasterDataModule {}
