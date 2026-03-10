import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { KategoriPangkatController } from './kategori-pangkat.controller';
import { KategoriPangkatService } from './kategori-pangkat.service';

@Module({
  imports: [AuthModule],
  controllers: [KategoriPangkatController],
  providers: [KategoriPangkatService],
})
export class KategoriPangkatModule {}
