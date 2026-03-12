import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PaginatedResponseDto } from '../../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreatePosisiJabatanDto } from './dto/create-posisi-jabatan.dto';
import { UpdatePosisiJabatanDto } from './dto/update-posisi-jabatan.dto';

@Injectable()
export class PosisiJabatanService extends BaseMasterDataService<
  CreatePosisiJabatanDto,
  UpdatePosisiJabatanDto
> {
  private readonly relationInclude = {
    department: {
      include: {
        divisi: {
          select: {
            id: true,
            code: true,
            nama: true,
            status: true,
          },
        },
      },
    },
  };

  constructor(prisma: PrismaService) {
    super(prisma, 'posisiJabatan', 'POS');
  }

  private async validateDepartment(departmentId: string): Promise<void> {
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        divisi: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Department tidak ditemukan');
    }

    if (department.status !== 'Aktif') {
      throw new BadRequestException('Department harus berstatus Aktif');
    }

    if (department.divisi.status !== 'Aktif') {
      throw new BadRequestException('Divisi pada Department harus berstatus Aktif');
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Record<string, unknown>>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = this.buildWhere(query);

    const [total, data] = await Promise.all([
      this.prisma.posisiJabatan.count({ where }),
      this.prisma.posisiJabatan.findMany({
        where,
        include: this.relationInclude,
        orderBy: this.getListOrderBy(),
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return new PaginatedResponseDto(data, page, limit, total);
  }

  async findOne(id: string) {
    const item = await this.prisma.posisiJabatan.findUnique({
      where: { id },
      include: this.relationInclude,
    });

    if (!item) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    return item;
  }

  async create(dto: CreatePosisiJabatanDto) {
    await this.validateDepartment(dto.department_id);
    return super.create(dto);
  }

  async update(id: string, dto: UpdatePosisiJabatanDto) {
    if (dto.department_id) {
      await this.validateDepartment(dto.department_id);
    }

    return super.update(id, dto);
  }

  async findAllActive(search?: string) {
    return this.prisma.posisiJabatan.findMany({
      where: {
        status: 'Aktif',
        department: {
          status: 'Aktif',
          divisi: {
            status: 'Aktif',
          },
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
