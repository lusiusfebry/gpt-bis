import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AppModuleController } from './app-module.controller';
import { AppModuleService } from './app-module.service';

@Module({
  imports: [AuthModule],
  controllers: [AppModuleController],
  providers: [AppModuleService],
})
export class AppModuleModule {}
