import { Module } from '@nestjs/common';

import { ImportModule } from './import/import.module';
import { KaryawanModule } from './karyawan/karyawan.module';
import { MasterDataModule } from './master-data/master-data.module';

@Module({
  imports: [MasterDataModule, KaryawanModule, ImportModule],
})
export class HrModule {}
