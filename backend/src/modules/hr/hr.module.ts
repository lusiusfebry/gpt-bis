import { Module } from '@nestjs/common';

import { KaryawanModule } from './karyawan/karyawan.module';
import { MasterDataModule } from './master-data/master-data.module';

@Module({
  imports: [MasterDataModule, KaryawanModule],
})
export class HrModule {}
