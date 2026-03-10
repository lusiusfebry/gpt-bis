import { join } from 'path';

import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { PrismaModule } from './common/prisma.module';
import configuration from './config/configuration';

@Controller()
class AppController {
  @Get()
  getRoot(): { message: string } {
    return {
      message: 'Backend Bebang Sistem Informasi aktif',
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
