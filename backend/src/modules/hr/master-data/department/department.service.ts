import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PaginatedResponseDto } from '../../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService extends BaseMasterDataService<
  CreateDepartmentDto,
  UpdateDepartmentDto
> {
  private readonly relationInclude = {
    divisi: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
      },
    },
  };

  constructor(prisma: PrismaService) {
    super(prisma, 'department', 'DEP');
  }

  private async validateDivisi(divisiId: string): Promise<void> {
    const divisi = await this.prisma.divisi.findUnique({
      where: { id: divisiId },
    });

    if (!divisi) {
      throw new NotFoundException('Divisi tidak ditemukan');
    }

    if (divisi.status !== 'Aktif') {
      throw new BadRequestException('Divisi harus berstatus Aktif');
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Record<string, unknown>>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = this.buildWhere(query);

    const [total, data] = await Promise.all([
      this.prisma.department.count({ where }),
      this.prisma.department.findMany({
        where,
        include: this.relationInclude,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return new PaginatedResponseDto(data, page, limit, total);
  }

  async findOne(id: string) {
    const item = await this.prisma.department.findUnique({
      where: { id },
      include: this.relationInclude,
    });

    if (!item) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    return item;
  }

  async create(dto: CreateDepartmentDto) {
    await this.validateDivisi(dto.divisi_id);
    return super.create(dto);
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    if (dto.divisi_id) {
      await this.validateDivisi(dto.divisi_id);
    }

    return super.update(id, dto);
  }

  async findAllActive(search?: string) {
    return this.prisma.department.findMany({
      where: {
        status: 'Aktif',
        divisi: {
          status: 'Aktif',
        },
        ...(search
          ? {
              nama: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      include: this.relationInclude,
      orderBy: { nama: 'asc' },
    });
  }
}
