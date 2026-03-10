import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { SubGolonganController } from './sub-golongan.controller';
import { SubGolonganService } from './sub-golongan.service';

@Module({
  imports: [AuthModule],
  controllers: [SubGolonganController],
  providers: [SubGolonganService],
})
export class SubGolonganModule {}
