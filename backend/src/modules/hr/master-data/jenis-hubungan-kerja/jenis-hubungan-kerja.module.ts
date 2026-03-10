import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { JenisHubunganKerjaController } from './jenis-hubungan-kerja.controller';
import { JenisHubunganKerjaService } from './jenis-hubungan-kerja.service';

@Module({
  imports: [AuthModule],
  controllers: [JenisHubunganKerjaController],
  providers: [JenisHubunganKerjaService],
})
export class JenisHubunganKerjaModule {}
