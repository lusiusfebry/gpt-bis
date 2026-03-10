const fs = require('fs');
const path = require('path');

const root = process.cwd();

function writeFile(relativePath, content) {
  const targetPath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
}

function removeFile(relativePath) {
  const targetPath = path.join(root, relativePath);
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
  }
}

writeFile(
  'backend/prisma/schema.prisma',
  `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                   String   @id @default(cuid())
  nomor_induk_karyawan String   @unique
  nama_lengkap         String
  password             String
  refresh_token        String?
  is_active            Boolean  @default(true)
  created_at           DateTime @default(now())
  updated_at           DateTime @updatedAt

  @@map("users")
}

model AppModule {
  id         String   @id @default(cuid())
  kode       String   @unique
  nama       String
  deskripsi  String
  ikon       String
  path       String
  is_aktif   Boolean  @default(false)
  urutan     Int      @default(0)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("app_modules")
}

model Divisi {
  id          String        @id @default(cuid())
  code        String        @unique
  nama        String
  keterangan  String?
  status      String        @default("Aktif")
  created_at  DateTime      @default(now())
  updated_at  DateTime      @updatedAt
  departments Department[]

  @@map("divisi")
}

model Department {
  id             String          @id @default(cuid())
  code           String          @unique
  nama           String
  manager_id     String?
  divisi_id      String
  keterangan     String?
  status         String          @default("Aktif")
  created_at     DateTime        @default(now())
  updated_at     DateTime        @updatedAt
  divisi         Divisi          @relation(fields: [divisi_id], references: [id])
  posisi_jabatan PosisiJabatan[]

  @@index([divisi_id])
  @@map("departments")
}

model PosisiJabatan {
  id            String     @id @default(cuid())
  code          String     @unique
  nama          String
  department_id String
  keterangan    String?
  status        String     @default("Aktif")
  created_at    DateTime   @default(now())
  updated_at    DateTime   @updatedAt
  department    Department @relation(fields: [department_id], references: [id])

  @@index([department_id])
  @@map("posisi_jabatan")
}

model KategoriPangkat {
  id         String   @id @default(cuid())
  code       String   @unique
  nama       String
  keterangan String?
  status     String   @default("Aktif")
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("kategori_pangkat")
}

model Golongan {
  id         String   @id @default(cuid())
  code       String   @unique
  nama       String
  keterangan String?
  status     String   @default("Aktif")
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("golongan")
}

model SubGolongan {
  id         String   @id @default(cuid())
  code       String   @unique
  nama       String
  keterangan String?
  status     String   @default("Aktif")
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("sub_golongan")
}

model JenisHubunganKerja {
  id         String   @id @default(cuid())
  code       String   @unique
  nama       String
  keterangan String?
  status     String   @default("Aktif")
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("jenis_hubungan_kerja")
}

model Tag {
  id         String   @id @default(cuid())
  code       String   @unique
  nama       String
  warna_tag  String
  keterangan String?
  status     String   @default("Aktif")
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("tags")
}

model LokasiKerja {
  id         String   @id @default(cuid())
  code       String   @unique
  nama       String
  alamat     String
  keterangan String?
  status     String   @default("Aktif")
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("lokasi_kerja")
}

model StatusKaryawan {
  id         String   @id @default(cuid())
  code       String   @unique
  nama       String
  keterangan String?
  status     String   @default("Aktif")
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("status_karyawan")
}
`,
);

writeFile(
  'backend/src/common/dto/pagination-query.dto.ts',
  `import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['Aktif', 'Tidak Aktif'])
  status?: string;
}
`,
);

writeFile(
  'backend/src/common/dto/paginated-response.dto.ts',
  `export class PaginatedResponseDto<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(data: T[], page: number, limit: number, total: number) {
    this.data = data;
    this.meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
`,
);

writeFile(
  'backend/src/common/utils/code-generator.util.ts',
  `export function generateMasterDataCode(prefix: string, sequence: number): string {
  return prefix + '-' + sequence.toString().padStart(5, '0');
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/base-master-data.service.ts',
  `import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PrismaService } from '../../../common/prisma.service';
import { generateMasterDataCode } from '../../../common/utils/code-generator.util';

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
  TCreateDto extends Record<string, unknown>,
  TUpdateDto extends Record<string, unknown>,
> {
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

  protected buildWhere(query: PaginationQueryDto): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.nama = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    return where;
  }

  protected sanitizeUpdatePayload(
    dto: TUpdateDto,
  ): Omit<TUpdateDto, 'code'> & Record<string, unknown> {
    const payload = { ...dto } as Omit<TUpdateDto, 'code'> & Record<string, unknown>;

    if ('code' in payload) {
      delete payload.code;
    }

    return payload;
  }

  protected async generateCode(): Promise<string> {
    const total = await this.model.count();
    let sequence = total + 1;

    while (true) {
      const candidate = generateMasterDataCode(this.codePrefix, sequence);
      const existing = await this.model.findFirst({
        where: {
          code: candidate,
        },
      });

      if (!existing) {
        return candidate;
      }

      sequence += 1;
    }
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
    const code = await this.generateCode();

    return this.model.create({
      data: {
        ...dto,
        code,
      },
    });
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
`,
);

writeFile(
  'backend/src/modules/hr/hr.module.ts',
  `import { Module } from '@nestjs/common';

import { MasterDataModule } from './master-data/master-data.module';

@Module({
  imports: [MasterDataModule],
})
export class HrModule {}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/master-data.module.ts',
  `import { Module } from '@nestjs/common';

import { DepartmentModule } from './department/department.module';
import { DivisiModule } from './divisi/divisi.module';
import { GolonganModule } from './golongan/golongan.module';
import { JenisHubunganKerjaModule } from './jenis-hubungan-kerja/jenis-hubungan-kerja.module';
import { KategoriPangkatModule } from './kategori-pangkat/kategori-pangkat.module';
import { LokasiKerjaModule } from './lokasi-kerja/lokasi-kerja.module';
import { PosisiJabatanModule } from './posisi-jabatan/posisi-jabatan.module';
import { StatusKaryawanModule } from './status-karyawan/status-karyawan.module';
import { SubGolonganModule } from './sub-golongan/sub-golongan.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    DivisiModule,
    DepartmentModule,
    PosisiJabatanModule,
    KategoriPangkatModule,
    GolonganModule,
    SubGolonganModule,
    JenisHubunganKerjaModule,
    TagModule,
    LokasiKerjaModule,
    StatusKaryawanModule,
  ],
})
export class MasterDataModule {}
`,
);

function createSimpleResource(resource) {
  const {
    folder,
    serviceName,
    moduleName,
    controllerName,
    createDtoName,
    updateDtoName,
    pathName,
    prismaModel,
    codePrefix,
  } = resource;

  writeFile(
    `backend/src/modules/hr/master-data/${folder}/dto/create-${folder}.dto.ts`,
    `import { IsIn, IsOptional, IsString } from 'class-validator';

export class ${createDtoName} {
  @IsString()
  nama: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsIn(['Aktif', 'Tidak Aktif'])
  status?: string;
}
`,
  );

  writeFile(
    `backend/src/modules/hr/master-data/${folder}/dto/update-${folder}.dto.ts`,
    `import { PartialType } from '@nestjs/mapped-types';

import { ${createDtoName} } from './create-${folder}.dto';

export class ${updateDtoName} extends PartialType(${createDtoName}) {}
`,
  );

  writeFile(
    `backend/src/modules/hr/master-data/${folder}/${folder}.service.ts`,
    `import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { ${createDtoName} } from './dto/create-${folder}.dto';
import { ${updateDtoName} } from './dto/update-${folder}.dto';

@Injectable()
export class ${serviceName} extends BaseMasterDataService<${createDtoName}, ${updateDtoName}> {
  constructor(prisma: PrismaService) {
    super(prisma, '${prismaModel}', '${codePrefix}');
  }
}
`,
  );

  writeFile(
    `backend/src/modules/hr/master-data/${folder}/${folder}.controller.ts`,
    `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ${serviceName} } from './${folder}.service';
import { ${createDtoName} } from './dto/create-${folder}.dto';
import { ${updateDtoName} } from './dto/update-${folder}.dto';

@Controller('hr/master-data/${pathName}')
@UseGuards(JwtAuthGuard)
export class ${controllerName} {
  constructor(private readonly ${folder.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Service: ${serviceName}) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.${folder.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Service.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.${folder.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Service.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${folder.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Service.findOne(id);
  }

  @Post()
  create(@Body() dto: ${createDtoName}) {
    return this.${folder.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: ${updateDtoName}) {
    return this.${folder.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${folder.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Service.remove(id);
  }
}
`,
  );

  writeFile(
    `backend/src/modules/hr/master-data/${folder}/${folder}.module.ts`,
    `import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { ${controllerName} } from './${folder}.controller';
import { ${serviceName} } from './${folder}.service';

@Module({
  imports: [AuthModule],
  controllers: [${controllerName}],
  providers: [${serviceName}],
})
export class ${moduleName} {}
`,
  );
}

createSimpleResource({
  folder: 'divisi',
  serviceName: 'DivisiService',
  moduleName: 'DivisiModule',
  controllerName: 'DivisiController',
  createDtoName: 'CreateDivisiDto',
  updateDtoName: 'UpdateDivisiDto',
  pathName: 'divisi',
  prismaModel: 'divisi',
  codePrefix: 'DIV',
});

createSimpleResource({
  folder: 'kategori-pangkat',
  serviceName: 'KategoriPangkatService',
  moduleName: 'KategoriPangkatModule',
  controllerName: 'KategoriPangkatController',
  createDtoName: 'CreateKategoriPangkatDto',
  updateDtoName: 'UpdateKategoriPangkatDto',
  pathName: 'kategori-pangkat',
  prismaModel: 'kategoriPangkat',
  codePrefix: 'KPG',
});

createSimpleResource({
  folder: 'golongan',
  serviceName: 'GolonganService',
  moduleName: 'GolonganModule',
  controllerName: 'GolonganController',
  createDtoName: 'CreateGolonganDto',
  updateDtoName: 'UpdateGolonganDto',
  pathName: 'golongan',
  prismaModel: 'golongan',
  codePrefix: 'GOL',
});

createSimpleResource({
  folder: 'sub-golongan',
  serviceName: 'SubGolonganService',
  moduleName: 'SubGolonganModule',
  controllerName: 'SubGolonganController',
  createDtoName: 'CreateSubGolonganDto',
  updateDtoName: 'UpdateSubGolonganDto',
  pathName: 'sub-golongan',
  prismaModel: 'subGolongan',
  codePrefix: 'SGO',
});

createSimpleResource({
  folder: 'jenis-hubungan-kerja',
  serviceName: 'JenisHubunganKerjaService',
  moduleName: 'JenisHubunganKerjaModule',
  controllerName: 'JenisHubunganKerjaController',
  createDtoName: 'CreateJenisHubunganKerjaDto',
  updateDtoName: 'UpdateJenisHubunganKerjaDto',
  pathName: 'jenis-hubungan-kerja',
  prismaModel: 'jenisHubunganKerja',
  codePrefix: 'JHK',
});

createSimpleResource({
  folder: 'status-karyawan',
  serviceName: 'StatusKaryawanService',
  moduleName: 'StatusKaryawanModule',
  controllerName: 'StatusKaryawanController',
  createDtoName: 'CreateStatusKaryawanDto',
  updateDtoName: 'UpdateStatusKaryawanDto',
  pathName: 'status-karyawan',
  prismaModel: 'statusKaryawan',
  codePrefix: 'STK',
});

writeFile(
  'backend/src/modules/hr/master-data/tag/dto/create-tag.dto.ts',
  `import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  nama: string;

  @IsString()
  warna_tag: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsIn(['Aktif', 'Tidak Aktif'])
  status?: string;
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/tag/dto/update-tag.dto.ts',
  `import { PartialType } from '@nestjs/mapped-types';

import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/tag/tag.service.ts',
  `import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService extends BaseMasterDataService<CreateTagDto, UpdateTagDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'tag', 'TAG');
  }
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/tag/tag.controller.ts',
  `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@Controller('hr/master-data/tag')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.tagService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.tagService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/tag/tag.module.ts',
  `import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [AuthModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/lokasi-kerja/dto/create-lokasi-kerja.dto.ts',
  `import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateLokasiKerjaDto {
  @IsString()
  nama: string;

  @IsString()
  alamat: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsIn(['Aktif', 'Tidak Aktif'])
  status?: string;
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/lokasi-kerja/dto/update-lokasi-kerja.dto.ts',
  `import { PartialType } from '@nestjs/mapped-types';

import { CreateLokasiKerjaDto } from './create-lokasi-kerja.dto';

export class UpdateLokasiKerjaDto extends PartialType(CreateLokasiKerjaDto) {}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/lokasi-kerja/lokasi-kerja.service.ts',
  `import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateLokasiKerjaDto } from './dto/create-lokasi-kerja.dto';
import { UpdateLokasiKerjaDto } from './dto/update-lokasi-kerja.dto';

@Injectable()
export class LokasiKerjaService extends BaseMasterDataService<
  CreateLokasiKerjaDto,
  UpdateLokasiKerjaDto
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'lokasiKerja', 'LKR');
  }
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/lokasi-kerja/lokasi-kerja.controller.ts',
  `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreateLokasiKerjaDto } from './dto/create-lokasi-kerja.dto';
import { UpdateLokasiKerjaDto } from './dto/update-lokasi-kerja.dto';
import { LokasiKerjaService } from './lokasi-kerja.service';

@Controller('hr/master-data/lokasi-kerja')
@UseGuards(JwtAuthGuard)
export class LokasiKerjaController {
  constructor(private readonly lokasiKerjaService: LokasiKerjaService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.lokasiKerjaService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.lokasiKerjaService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lokasiKerjaService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateLokasiKerjaDto) {
    return this.lokasiKerjaService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLokasiKerjaDto) {
    return this.lokasiKerjaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lokasiKerjaService.remove(id);
  }
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/lokasi-kerja/lokasi-kerja.module.ts',
  `import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { LokasiKerjaController } from './lokasi-kerja.controller';
import { LokasiKerjaService } from './lokasi-kerja.service';

@Module({
  imports: [AuthModule],
  controllers: [LokasiKerjaController],
  providers: [LokasiKerjaService],
})
export class LokasiKerjaModule {}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/department/dto/create-department.dto.ts',
  `import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  nama: string;

  @IsString()
  divisi_id: string;

  @IsOptional()
  @IsString()
  manager_id?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsIn(['Aktif', 'Tidak Aktif'])
  status?: string;
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/department/dto/update-department.dto.ts',
  `import { PartialType } from '@nestjs/mapped-types';

import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/department/department.service.ts',
  `import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

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
`,
);

writeFile(
  'backend/src/modules/hr/master-data/department/department.controller.ts',
  `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('hr/master-data/department')
@UseGuards(JwtAuthGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.departmentService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.departmentService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/department/department.module.ts',
  `import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [AuthModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/posisi-jabatan/dto/create-posisi-jabatan.dto.ts',
  `import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreatePosisiJabatanDto {
  @IsString()
  nama: string;

  @IsString()
  department_id: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsIn(['Aktif', 'Tidak Aktif'])
  status?: string;
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/posisi-jabatan/dto/update-posisi-jabatan.dto.ts',
  `import { PartialType } from '@nestjs/mapped-types';

import { CreatePosisiJabatanDto } from './create-posisi-jabatan.dto';

export class UpdatePosisiJabatanDto extends PartialType(CreatePosisiJabatanDto) {}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/posisi-jabatan/posisi-jabatan.service.ts',
  `import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

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
        orderBy: { created_at: 'desc' },
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
`,
);

writeFile(
  'backend/src/modules/hr/master-data/posisi-jabatan/posisi-jabatan.controller.ts',
  `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreatePosisiJabatanDto } from './dto/create-posisi-jabatan.dto';
import { UpdatePosisiJabatanDto } from './dto/update-posisi-jabatan.dto';
import { PosisiJabatanService } from './posisi-jabatan.service';

@Controller('hr/master-data/posisi-jabatan')
@UseGuards(JwtAuthGuard)
export class PosisiJabatanController {
  constructor(private readonly posisiJabatanService: PosisiJabatanService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.posisiJabatanService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.posisiJabatanService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posisiJabatanService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePosisiJabatanDto) {
    return this.posisiJabatanService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePosisiJabatanDto) {
    return this.posisiJabatanService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posisiJabatanService.remove(id);
  }
}
`,
);

writeFile(
  'backend/src/modules/hr/master-data/posisi-jabatan/posisi-jabatan.module.ts',
  `import { Module } from '@nestjs/common';

import { AuthModule } from '../../../auth/auth.module';
import { PosisiJabatanController } from './posisi-jabatan.controller';
import { PosisiJabatanService } from './posisi-jabatan.service';

@Module({
  imports: [AuthModule],
  controllers: [PosisiJabatanController],
  providers: [PosisiJabatanService],
})
export class PosisiJabatanModule {}
`,
);

writeFile(
  'backend/src/app.module.ts',
  `import { join } from 'path';

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
`,
);

removeFile('backend/src/modules/hr/.gitkeep');
console.log('Implementasi HR master data berhasil ditulis.');
