import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { LokasiKerjaController } from './lokasi-kerja.controller';
import { LokasiKerjaService } from './lokasi-kerja.service';

@Module({
  imports: [AuthModule],
  controllers: [LokasiKerjaController],
  providers: [LokasiKerjaService],
})
export class LokasiKerjaModule {}
