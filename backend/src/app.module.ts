import { join } from 'path';

import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { PrismaModule } from './common/prisma.module';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';

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
            serveRoot: `/${uploadDir}`,
          },
        ];
      },
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
