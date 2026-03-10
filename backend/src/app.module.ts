import { join } from 'path';

import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { PrismaModule } from './common/prisma.module';
import configuration from './config/configuration';
import { AppModuleModule } from './modules/app-module/app-module.module';
import { AuthModule } from './modules/auth/auth.module';
import { HrModule } from './modules/hr/hr.module';

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
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uploadDir = configService.get<string>('uploadDir', 'uploads');

        return [
          {
            rootPath: join(process.cwd(), uploadDir),
            serveRoot: "/" + uploadDir,
          },
        ];
      },
    }),
    PrismaModule,
    AuthModule,
    AppModuleModule,
    HrModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
