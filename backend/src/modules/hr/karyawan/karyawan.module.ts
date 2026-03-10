import { Module } from '@nestjs/common';

import { PrismaModule } from '../../../common/prisma.module';
import { KaryawanController } from './karyawan.controller';
import { KaryawanService } from './karyawan.service';

@Module({
  imports: [PrismaModule],
  controllers: [KaryawanController],
  providers: [KaryawanService],
  exports: [KaryawanService],
})
export class KaryawanModule {}
