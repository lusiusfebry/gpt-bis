import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { GolonganController } from './golongan.controller';
import { GolonganService } from './golongan.service';

@Module({
  imports: [AuthModule],
  controllers: [GolonganController],
  providers: [GolonganService],
})
export class GolonganModule {}
