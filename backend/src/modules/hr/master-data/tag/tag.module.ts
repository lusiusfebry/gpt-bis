import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [AuthModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
