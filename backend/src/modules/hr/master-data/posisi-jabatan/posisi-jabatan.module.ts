import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { PosisiJabatanController } from './posisi-jabatan.controller';
import { PosisiJabatanService } from './posisi-jabatan.service';

@Module({
  imports: [AuthModule],
  controllers: [PosisiJabatanController],
  providers: [PosisiJabatanService],
})
export class PosisiJabatanModule {}
