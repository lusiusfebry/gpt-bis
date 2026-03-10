import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { StatusKaryawanController } from './status-karyawan.controller';
import { StatusKaryawanService } from './status-karyawan.service';

@Module({
  imports: [AuthModule],
  controllers: [StatusKaryawanController],
  providers: [StatusKaryawanService],
})
export class StatusKaryawanModule {}
