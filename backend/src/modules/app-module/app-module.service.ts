import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma.service';
import { ModuleResponseDto } from './dto/module-response.dto';

@Injectable()
export class AppModuleService {
  private readonly moduleResponseSelect = {
    id: true,
    kode: true,
    nama: true,
    deskripsi: true,
    ikon: true,
    path: true,
    is_aktif: true,
    urutan: true,
  };

  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<ModuleResponseDto[]> {
    return this.prismaService.appModule.findMany({
      select: this.moduleResponseSelect,
      orderBy: {
        urutan: 'asc',
      },
    });
  }

  async findActive(): Promise<ModuleResponseDto[]> {
    return this.prismaService.appModule.findMany({
      where: {
        is_aktif: true,
      },
      select: this.moduleResponseSelect,
      orderBy: {
        urutan: 'asc',
      },
    });
  }
}
