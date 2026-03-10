import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PrismaService } from '../../../common/prisma.service';
import {
  extractMasterDataSequence,
  generateMasterDataCode,
} from '../../../common/utils/code-generator.util';

type PrismaModelDelegate = {
  count(args?: Record<string, unknown>): Promise<number>;
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  findFirst(args?: Record<string, unknown>): Promise<Record<string, unknown> | null>;
  findMany(args?: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  findUnique(args: Record<string, unknown>): Promise<Record<string, unknown> | null>;
  update(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

@Injectable()
export abstract class BaseMasterDataService<
  TCreateDto extends object,
  TUpdateDto extends object,
> {
  private static readonly MAX_CREATE_RETRIES = 5;

  protected constructor(
    protected readonly prisma: PrismaService,
    private readonly modelName: string,
    private readonly codePrefix: string,
  ) {}

  protected get model(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>)[
      this.modelName
    ];
  }

  protected normalizeStatus(status?: string): string | undefined {
    if (!status) {
      return undefined;
    }

    const normalizedStatus = status.trim().toLowerCase();

    if (normalizedStatus === 'aktif') {
      return 'Aktif';
    }

    if (normalizedStatus === 'tidak aktif') {
      return 'Tidak Aktif';
    }

    return status;
  }

  protected buildWhere(query: PaginationQueryDto): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.nama = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    const normalizedStatus = this.normalizeStatus(query.status);

    if (normalizedStatus) {
      where.status = normalizedStatus;
    }

    return where;
  }

  protected sanitizeUpdatePayload(
    dto: TUpdateDto,
  ): Omit<TUpdateDto, 'code'> & Record<string, unknown> {
    const payload = {
      ...dto,
    } as Omit<TUpdateDto, 'code'> & Record<string, unknown>;

    if ('code' in payload) {
      delete payload.code;
    }

    return payload;
  }

  protected async generateCode(model: PrismaModelDelegate = this.model): Promise<string> {
    const highestCodeRecord = await model.findFirst({
      where: {
        code: {
          startsWith: `${this.codePrefix}-`,
        },
      },
      orderBy: {
        code: 'desc',
      },
      select: {
        code: true,
      },
    });

    const highestSequence = extractMasterDataSequence(
      typeof highestCodeRecord?.code === 'string' ? highestCodeRecord.code : undefined,
      this.codePrefix,
    );

    return generateMasterDataCode(this.codePrefix, highestSequence + 1);
  }

  protected async findById(id: string): Promise<Record<string, unknown>> {
    const item = await this.model.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    return item;
  }

  protected isCodeUniqueConstraintError(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes('code')
    );
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Record<string, unknown>>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = this.buildWhere(query);

    const [total, data] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return new PaginatedResponseDto(data, page, limit, total);
  }

  async findOne(id: string): Promise<Record<string, unknown>> {
    return this.findById(id);
  }

  async create(dto: TCreateDto): Promise<Record<string, unknown>> {
    for (let attempt = 0; attempt < BaseMasterDataService.MAX_CREATE_RETRIES; attempt += 1) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const transactionalModel = (tx as unknown as Record<string, PrismaModelDelegate>)[
            this.modelName
          ];
          const code = await this.generateCode(transactionalModel);

          return transactionalModel.create({
            data: {
              ...dto,
              code,
            },
          });
        });
      } catch (error) {
        if (
          this.isCodeUniqueConstraintError(error) &&
          attempt < BaseMasterDataService.MAX_CREATE_RETRIES - 1
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new BadRequestException('Gagal membuat data master dengan kode unik');
  }

  async update(id: string, dto: TUpdateDto): Promise<Record<string, unknown>> {
    await this.findById(id);

    const data = this.sanitizeUpdatePayload(dto);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Tidak ada data yang diperbarui');
    }

    return this.model.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Record<string, unknown>> {
    const current = await this.findById(id);
    const currentStatus = current.status === 'Tidak Aktif' ? 'Tidak Aktif' : 'Aktif';
    const nextStatus = currentStatus === 'Aktif' ? 'Tidak Aktif' : 'Aktif';

    return this.model.update({
      where: { id },
      data: {
        status: nextStatus,
      },
    });
  }

  async findAllActive(search?: string): Promise<Record<string, unknown>[]> {
    const where: Record<string, unknown> = {
      status: 'Aktif',
    };

    if (search) {
      where.nama = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return this.model.findMany({
      where,
      orderBy: { nama: 'asc' },
    });
  }
}
