import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { DivisiController } from './divisi.controller';
import { DivisiService } from './divisi.service';

@Module({
  imports: [AuthModule],
  controllers: [DivisiController],
  providers: [DivisiService],
})
export class DivisiModule {}
