import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import * as QRCode from 'qrcode';

import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { PrismaService } from '../../../common/prisma.service';
import { CreateKaryawanDto } from './dto/create-karyawan.dto';
import { KaryawanQueryDto } from './dto/karyawan-query.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';

type ActiveMasterData = {
  id: string;
  status: string;
};

type EmployeeRecord = Record<string, unknown>;
type EmployeeReferenceValidation = {
  id: string;
  nama_lengkap: string;
  is_deleted: boolean;
  posisi_jabatan?: {
    nama: string;
    status: string;
  } | null;
  status_karyawan?: {
    nama: string;
    status: string;
  } | null;
};
type PrismaModelDelegate = {
  count(args?: Record<string, unknown>): Promise<number>;
  create(args: Record<string, unknown>): Promise<EmployeeRecord>;
  findFirst(args?: Record<string, unknown>): Promise<EmployeeRecord | null>;
  findMany(args?: Record<string, unknown>): Promise<EmployeeRecord[]>;
  findUnique(args: Record<string, unknown>): Promise<EmployeeRecord | null>;
  update(args: Record<string, unknown>): Promise<EmployeeRecord>;
};

type UploadFile = {
  originalname: string;
  buffer: Buffer;
};

type EmployeeOptionRecord = {
  id: string;
  nama_lengkap: string;
  nomor_induk_karyawan: string;
  status_karyawan: {
    nama: string;
    status: string;
  } | null;
  posisi_jabatan: {
    nama: string;
    status: string;
  } | null;
};

type ExistingEmployeeEducationRecord = {
  id: string;
};

@Injectable()
export class KaryawanService {
  constructor(private readonly prisma: PrismaService) {}

  private get employeeModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).employee;
  }

  private get divisiModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).divisi;
  }

  private get departmentModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).department;
  }

  private get posisiJabatanModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).posisiJabatan;
  }

  private get statusKaryawanModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).statusKaryawan;
  }

  private get lokasiKerjaModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).lokasiKerja;
  }

  private get tagModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).tag;
  }

  private get jenisHubunganKerjaModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).jenisHubunganKerja;
  }

  private get kategoriPangkatModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).kategoriPangkat;
  }

  private get golonganModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).golongan;
  }

  private get subGolonganModel(): PrismaModelDelegate {
    return (this.prisma as unknown as Record<string, PrismaModelDelegate>).subGolongan;
  }

  private readonly employeeRelationSummary = {
    id: true,
    nomor_induk_karyawan: true,
    nama_lengkap: true,
    foto_karyawan: true,
  } as const;

  private readonly listInclude = {
    user: {
      select: {
        id: true,
        nomor_induk_karyawan: true,
        nama_lengkap: true,
        is_active: true,
      },
    },
    divisi: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
      },
    },
    department: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
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
    manager: {
      select: {
        ...this.employeeRelationSummary,
      },
    },
    atasan_langsung: {
      select: {
        ...this.employeeRelationSummary,
      },
    },
    posisi_jabatan: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
        department: {
          select: {
            id: true,
            code: true,
            nama: true,
            status: true,
          },
        },
      },
    },
    status_karyawan: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
      },
    },
    lokasi_kerja: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
      },
    },
    tag: {
      select: {
        id: true,
        code: true,
        nama: true,
        warna_tag: true,
        status: true,
      },
    },
  };

  private readonly detailInclude = {
    ...this.listInclude,
    lokasi_sebelumnya: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
      },
    },
    jenis_hubungan_kerja: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
      },
    },
    kategori_pangkat: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
      },
    },
    golongan: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
      },
    },
    sub_golongan: {
      select: {
        id: true,
        code: true,
        nama: true,
        status: true,
      },
    },
    family: true,
    children: {
      orderBy: {
        created_at: 'asc',
      },
    },
    siblings: {
      orderBy: {
        created_at: 'asc',
      },
    },
    educations: {
      orderBy: {
        created_at: 'asc',
      },
    },
  };

  private buildWhere(query: KaryawanQueryDto): Record<string, unknown> {
    const where: Record<string, unknown> = {
      is_deleted: false,
    };

    if (query.divisi_id) {
      where.divisi_id = query.divisi_id;
    }

    if (query.department_id) {
      where.department_id = query.department_id;
    }

    if (query.status_karyawan_id) {
      where.status_karyawan_id = query.status_karyawan_id;
    }

    if (query.lokasi_kerja_id) {
      where.lokasi_kerja_id = query.lokasi_kerja_id;
    }

    if (query.search) {
      where.OR = [
        {
          nama_lengkap: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          nomor_induk_karyawan: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }

  private normalizeDate(value?: string | null): Date | undefined {
    if (!value) {
      return undefined;
    }

    const normalizedDate = new Date(value);

    if (Number.isNaN(normalizedDate.getTime())) {
      throw new BadRequestException('Format tanggal tidak valid');
    }

    return normalizedDate;
  }

  private normalizeOptionalText(value?: string | null): string | undefined {
    const trimmedValue = value?.trim();
    return trimmedValue ? trimmedValue : undefined;
  }

  private isEducationPayloadEmpty(education: {
    tingkat_pendidikan?: string | null;
    bidang_studi?: string | null;
    nama_sekolah?: string | null;
    kota_sekolah?: string | null;
    status_kelulusan?: string | null;
    keterangan?: string | null;
  }): boolean {
    return ![
      education.tingkat_pendidikan,
      education.bidang_studi,
      education.nama_sekolah,
      education.kota_sekolah,
      education.status_kelulusan,
      education.keterangan,
    ].some((value) => this.normalizeOptionalText(value) !== undefined);
  }

  private async validateActiveMasterData<T extends ActiveMasterData>(
    label: string,
    finder: () => Promise<T | null>,
  ): Promise<T> {
    const item = await finder();

    if (!item) {
      throw new NotFoundException(`${label} tidak ditemukan`);
    }

    if (item.status !== 'Aktif') {
      throw new BadRequestException(`${label} harus berstatus Aktif`);
    }

    return item;
  }

  private async validateUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (!user.is_active) {
      throw new BadRequestException('User harus aktif');
    }

    return user;
  }

  private isEmployeeActive(employee: EmployeeReferenceValidation): boolean {
    return (
      employee.status_karyawan?.status === 'Aktif' &&
      employee.status_karyawan.nama.toLowerCase() === 'aktif'
    );
  }

  private isHeadEmployee(employee: EmployeeReferenceValidation): boolean {
    return (
      this.isEmployeeActive(employee) &&
      employee.posisi_jabatan?.status === 'Aktif' &&
      employee.posisi_jabatan.nama.toLowerCase().includes('head')
    );
  }

  private async validateEmployeeReference(
    employeeId: string,
    label: string,
    currentEmployeeId?: string,
  ): Promise<EmployeeReferenceValidation> {
    if (currentEmployeeId && employeeId === currentEmployeeId) {
      throw new BadRequestException(`${label} tidak boleh sama dengan karyawan`);
    }

    const employee = (await this.employeeModel.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        nama_lengkap: true,
        is_deleted: true,
        posisi_jabatan: {
          select: {
            nama: true,
            status: true,
          },
        },
        status_karyawan: {
          select: {
            nama: true,
            status: true,
          },
        },
      },
    })) as EmployeeReferenceValidation | null;

    if (!employee || employee.is_deleted) {
      throw new NotFoundException(`${label} tidak ditemukan`);
    }

    return employee;
  }

  private async validateRelations(
    dto: CreateKaryawanDto | UpdateKaryawanDto,
    currentEmployeeId?: string,
  ): Promise<void> {
    if (dto.user_id) {
      await this.validateUser(dto.user_id);
    }

    const divisi = dto.divisi_id
      ? await this.validateActiveMasterData<ActiveMasterData>('Divisi', () =>
          this.divisiModel.findUnique({
            where: { id: dto.divisi_id },
          }) as Promise<ActiveMasterData | null>,
        )
      : null;

    const department = dto.department_id
      ? await this.validateActiveMasterData<ActiveMasterData & { divisi_id: string }>(
          'Department',
          () =>
            this.departmentModel.findUnique({
              where: { id: dto.department_id },
            }) as Promise<(ActiveMasterData & { divisi_id: string }) | null>,
        )
      : null;

    if (divisi && department && department.divisi_id !== divisi.id) {
      throw new BadRequestException('Department tidak sesuai dengan divisi yang dipilih');
    }

    const posisiJabatan = dto.posisi_jabatan_id
      ? await this.validateActiveMasterData<ActiveMasterData & { department_id: string }>(
          'Posisi jabatan',
          () =>
            this.posisiJabatanModel.findUnique({
              where: { id: dto.posisi_jabatan_id },
            }) as Promise<(ActiveMasterData & { department_id: string }) | null>,
        )
      : null;

    if (department && posisiJabatan && posisiJabatan.department_id !== department.id) {
      throw new BadRequestException(
        'Posisi jabatan tidak sesuai dengan department yang dipilih',
      );
    }

    if (dto.status_karyawan_id) {
      await this.validateActiveMasterData<ActiveMasterData>('Status karyawan', () =>
        this.statusKaryawanModel.findUnique({
          where: { id: dto.status_karyawan_id },
        }) as Promise<ActiveMasterData | null>,
      );
    }

    if (dto.lokasi_kerja_id) {
      await this.validateActiveMasterData<ActiveMasterData>('Lokasi kerja', () =>
        this.lokasiKerjaModel.findUnique({
          where: { id: dto.lokasi_kerja_id },
        }) as Promise<ActiveMasterData | null>,
      );
    }

    if (dto.tag_id) {
      await this.validateActiveMasterData<ActiveMasterData>('Tag', () =>
        this.tagModel.findUnique({
          where: { id: dto.tag_id },
        }) as Promise<ActiveMasterData | null>,
      );
    }

    if (dto.jenis_hubungan_kerja_id) {
      await this.validateActiveMasterData<ActiveMasterData>('Jenis hubungan kerja', () =>
        this.jenisHubunganKerjaModel.findUnique({
          where: { id: dto.jenis_hubungan_kerja_id },
        }) as Promise<ActiveMasterData | null>,
      );
    }

    if (dto.kategori_pangkat_id) {
      await this.validateActiveMasterData<ActiveMasterData>('Kategori pangkat', () =>
        this.kategoriPangkatModel.findUnique({
          where: { id: dto.kategori_pangkat_id },
        }) as Promise<ActiveMasterData | null>,
      );
    }

    if (dto.golongan_id) {
      await this.validateActiveMasterData<ActiveMasterData>('Golongan', () =>
        this.golonganModel.findUnique({
          where: { id: dto.golongan_id },
        }) as Promise<ActiveMasterData | null>,
      );
    }

    if (dto.sub_golongan_id) {
      await this.validateActiveMasterData<ActiveMasterData>('Sub golongan', () =>
        this.subGolonganModel.findUnique({
          where: { id: dto.sub_golongan_id },
        }) as Promise<ActiveMasterData | null>,
      );
    }

    if (dto.lokasi_sebelumnya_id) {
      await this.validateActiveMasterData<ActiveMasterData>('Lokasi sebelumnya', () =>
        this.lokasiKerjaModel.findUnique({
          where: { id: dto.lokasi_sebelumnya_id },
        }) as Promise<ActiveMasterData | null>,
      );
    }

    if (dto.manager_id) {
      const manager = await this.validateEmployeeReference(
        dto.manager_id,
        'Manager',
        currentEmployeeId,
      );

      if (!this.isHeadEmployee(manager)) {
        throw new BadRequestException('Manager harus karyawan aktif dengan posisi head');
      }
    }

    if (dto.atasan_langsung_id) {
      const atasanLangsung = await this.validateEmployeeReference(
        dto.atasan_langsung_id,
        'Atasan langsung',
        currentEmployeeId,
      );

      if (!this.isEmployeeActive(atasanLangsung)) {
        throw new BadRequestException('Atasan langsung harus karyawan aktif');
      }
    }
  }

  private buildEmployeeScalarData(dto: CreateKaryawanDto | UpdateKaryawanDto): EmployeeRecord {
    const family = dto.family;
    const normalizedPhoneNumber =
      dto.nomor_handphone !== undefined ? dto.nomor_handphone ?? null : undefined;

    return {
      ...(dto.user_id !== undefined ? { user_id: dto.user_id } : {}),
      ...(dto.nama_lengkap !== undefined ? { nama_lengkap: dto.nama_lengkap } : {}),
      ...(dto.nomor_induk_karyawan !== undefined
        ? { nomor_induk_karyawan: dto.nomor_induk_karyawan }
        : {}),
      ...(dto.divisi_id !== undefined ? { divisi_id: dto.divisi_id } : {}),
      ...(dto.department_id !== undefined ? { department_id: dto.department_id } : {}),
      ...(dto.manager_id !== undefined ? { manager_id: dto.manager_id } : {}),
      ...(dto.atasan_langsung_id !== undefined
        ? { atasan_langsung_id: dto.atasan_langsung_id }
        : {}),
      ...(dto.posisi_jabatan_id !== undefined
        ? { posisi_jabatan_id: dto.posisi_jabatan_id }
        : {}),
      ...(dto.email_perusahaan !== undefined
        ? { email_perusahaan: dto.email_perusahaan }
        : {}),
      ...(normalizedPhoneNumber !== undefined
        ? {
            nomor_handphone: normalizedPhoneNumber,
            nomor_handphone_1: normalizedPhoneNumber,
          }
        : {}),
      ...(dto.status_karyawan_id !== undefined
        ? { status_karyawan_id: dto.status_karyawan_id }
        : {}),
      ...(dto.lokasi_kerja_id !== undefined ? { lokasi_kerja_id: dto.lokasi_kerja_id } : {}),
      ...(dto.tag_id !== undefined ? { tag_id: dto.tag_id } : {}),
      ...(dto.jenis_kelamin !== undefined ? { jenis_kelamin: dto.jenis_kelamin } : {}),
      ...(dto.tempat_lahir !== undefined ? { tempat_lahir: dto.tempat_lahir } : {}),
      ...(dto.tanggal_lahir !== undefined
        ? { tanggal_lahir: this.normalizeDate(dto.tanggal_lahir) ?? null }
        : {}),
      ...(dto.email_pribadi !== undefined ? { email_pribadi: dto.email_pribadi } : {}),
      ...(dto.agama !== undefined ? { agama: dto.agama } : {}),
      ...(dto.golongan_darah !== undefined ? { golongan_darah: dto.golongan_darah } : {}),
      ...(dto.nomor_kartu_keluarga !== undefined
        ? { nomor_kartu_keluarga: dto.nomor_kartu_keluarga }
        : {}),
      ...(dto.nomor_ktp !== undefined ? { nomor_ktp: dto.nomor_ktp } : {}),
      ...(dto.nomor_npwp !== undefined ? { nomor_npwp: dto.nomor_npwp } : {}),
      ...(dto.nomor_bpjs !== undefined ? { nomor_bpjs: dto.nomor_bpjs } : {}),
      ...(dto.no_nik_kk !== undefined ? { no_nik_kk: dto.no_nik_kk } : {}),
      ...(dto.status_pajak !== undefined ? { status_pajak: dto.status_pajak } : {}),
      ...(dto.alamat_domisili !== undefined ? { alamat_domisili: dto.alamat_domisili } : {}),
      ...(dto.kota_domisili !== undefined ? { kota_domisili: dto.kota_domisili } : {}),
      ...(dto.provinsi_domisili !== undefined
        ? { provinsi_domisili: dto.provinsi_domisili }
        : {}),
      ...(dto.alamat_ktp !== undefined ? { alamat_ktp: dto.alamat_ktp } : {}),
      ...(dto.kota_ktp !== undefined ? { kota_ktp: dto.kota_ktp } : {}),
      ...(dto.provinsi_ktp !== undefined ? { provinsi_ktp: dto.provinsi_ktp } : {}),
      ...(dto.nomor_handphone_2 !== undefined
        ? { nomor_handphone_2: dto.nomor_handphone_2 }
        : {}),
      ...(dto.nomor_telepon_rumah_1 !== undefined
        ? { nomor_telepon_rumah_1: dto.nomor_telepon_rumah_1 }
        : {}),
      ...(dto.nomor_telepon_rumah_2 !== undefined
        ? { nomor_telepon_rumah_2: dto.nomor_telepon_rumah_2 }
        : {}),
      ...(dto.status_pernikahan !== undefined
        ? { status_pernikahan: dto.status_pernikahan }
        : {}),
      ...(dto.nama_pasangan !== undefined ? { nama_pasangan: dto.nama_pasangan } : {}),
      ...(dto.tanggal_menikah !== undefined
        ? { tanggal_menikah: this.normalizeDate(dto.tanggal_menikah) ?? null }
        : {}),
      ...(dto.tanggal_cerai !== undefined
        ? { tanggal_cerai: this.normalizeDate(dto.tanggal_cerai) ?? null }
        : {}),
      ...(dto.tanggal_wafat_pasangan !== undefined
        ? {
            tanggal_wafat_pasangan:
              this.normalizeDate(dto.tanggal_wafat_pasangan) ?? null,
          }
        : {}),
      ...(dto.pekerjaan_pasangan !== undefined
        ? { pekerjaan_pasangan: dto.pekerjaan_pasangan }
        : {}),
      ...(dto.jumlah_anak !== undefined ? { jumlah_anak: dto.jumlah_anak } : {}),
      ...(dto.nomor_rekening !== undefined ? { nomor_rekening: dto.nomor_rekening } : {}),
      ...(dto.nama_pemegang_rekening !== undefined
        ? { nama_pemegang_rekening: dto.nama_pemegang_rekening }
        : {}),
      ...(dto.nama_bank !== undefined ? { nama_bank: dto.nama_bank } : {}),
      ...(dto.cabang_bank !== undefined ? { cabang_bank: dto.cabang_bank } : {}),
      ...(dto.jenis_hubungan_kerja_id !== undefined
        ? { jenis_hubungan_kerja_id: dto.jenis_hubungan_kerja_id }
        : {}),
      ...(dto.tanggal_masuk_group !== undefined
        ? { tanggal_masuk_group: this.normalizeDate(dto.tanggal_masuk_group) ?? null }
        : {}),
      ...(dto.tanggal_masuk !== undefined
        ? { tanggal_masuk: this.normalizeDate(dto.tanggal_masuk) ?? null }
        : {}),
      ...(dto.tanggal_permanent !== undefined
        ? { tanggal_permanent: this.normalizeDate(dto.tanggal_permanent) ?? null }
        : {}),
      ...(dto.tanggal_kontrak !== undefined
        ? { tanggal_kontrak: this.normalizeDate(dto.tanggal_kontrak) ?? null }
        : {}),
      ...(dto.tanggal_akhir_kontrak !== undefined
        ? {
            tanggal_akhir_kontrak:
              this.normalizeDate(dto.tanggal_akhir_kontrak) ?? null,
          }
        : {}),
      ...(dto.tanggal_berhenti !== undefined
        ? { tanggal_berhenti: this.normalizeDate(dto.tanggal_berhenti) ?? null }
        : {}),
      ...(dto.kategori_pangkat_id !== undefined
        ? { kategori_pangkat_id: dto.kategori_pangkat_id }
        : {}),
      ...(dto.golongan_id !== undefined ? { golongan_id: dto.golongan_id } : {}),
      ...(dto.sub_golongan_id !== undefined
        ? { sub_golongan_id: dto.sub_golongan_id }
        : {}),
      ...(dto.no_dana_pensiun !== undefined ? { no_dana_pensiun: dto.no_dana_pensiun } : {}),
      ...(dto.nama_kontak_darurat_1 !== undefined
        ? { nama_kontak_darurat_1: dto.nama_kontak_darurat_1 }
        : {}),
      ...(dto.nomor_telepon_kontak_darurat_1 !== undefined
        ? {
            nomor_telepon_kontak_darurat_1: dto.nomor_telepon_kontak_darurat_1,
          }
        : {}),
      ...(dto.hubungan_kontak_darurat_1 !== undefined
        ? { hubungan_kontak_darurat_1: dto.hubungan_kontak_darurat_1 }
        : {}),
      ...(dto.alamat_kontak_darurat_1 !== undefined
        ? { alamat_kontak_darurat_1: dto.alamat_kontak_darurat_1 }
        : {}),
      ...(dto.nama_kontak_darurat_2 !== undefined
        ? { nama_kontak_darurat_2: dto.nama_kontak_darurat_2 }
        : {}),
      ...(dto.nomor_telepon_kontak_darurat_2 !== undefined
        ? {
            nomor_telepon_kontak_darurat_2: dto.nomor_telepon_kontak_darurat_2,
          }
        : {}),
      ...(dto.hubungan_kontak_darurat_2 !== undefined
        ? { hubungan_kontak_darurat_2: dto.hubungan_kontak_darurat_2 }
        : {}),
      ...(dto.alamat_kontak_darurat_2 !== undefined
        ? { alamat_kontak_darurat_2: dto.alamat_kontak_darurat_2 }
        : {}),
      ...(dto.point_of_original !== undefined
        ? { point_of_original: dto.point_of_original }
        : {}),
      ...(dto.point_of_hire !== undefined ? { point_of_hire: dto.point_of_hire } : {}),
      ...(dto.ukuran_seragam_kerja !== undefined
        ? { ukuran_seragam_kerja: dto.ukuran_seragam_kerja }
        : {}),
      ...(dto.ukuran_sepatu_kerja !== undefined
        ? { ukuran_sepatu_kerja: dto.ukuran_sepatu_kerja }
        : {}),
      ...(dto.lokasi_sebelumnya_id !== undefined
        ? { lokasi_sebelumnya_id: dto.lokasi_sebelumnya_id }
        : {}),
      ...(dto.tanggal_mutasi !== undefined
        ? { tanggal_mutasi: this.normalizeDate(dto.tanggal_mutasi) ?? null }
        : {}),
      ...(dto.siklus_pembayaran_gaji !== undefined
        ? { siklus_pembayaran_gaji: dto.siklus_pembayaran_gaji }
        : {}),
      ...(dto.costing !== undefined ? { costing: dto.costing } : {}),
      ...(dto.assign !== undefined ? { assign: dto.assign } : {}),
      ...(dto.actual !== undefined ? { actual: dto.actual } : {}),
      ...(family?.tanggal_lahir_pasangan !== undefined
        ? {
            tanggal_lahir_pasangan:
              this.normalizeDate(family.tanggal_lahir_pasangan) ?? null,
          }
        : {}),
      ...(family?.pendidikan_terakhir_pasangan !== undefined
        ? {
            pendidikan_terakhir_pasangan: family.pendidikan_terakhir_pasangan,
          }
        : {}),
      ...(family?.pekerjaan_pasangan !== undefined
        ? { pekerjaan_pasangan: family.pekerjaan_pasangan }
        : {}),
      ...(family?.jumlah_anak !== undefined ? { jumlah_anak: family.jumlah_anak } : {}),
      ...(family?.keterangan_pasangan !== undefined
        ? { keterangan_pasangan: family.keterangan_pasangan }
        : {}),
      ...(family?.anak_ke !== undefined ? { anak_ke: family.anak_ke } : {}),
      ...(family?.jumlah_saudara_kandung !== undefined
        ? { jumlah_saudara_kandung: family.jumlah_saudara_kandung }
        : {}),
      ...(family?.nama_ayah_mertua !== undefined
        ? { nama_ayah_mertua: family.nama_ayah_mertua }
        : {}),
      ...(family?.tanggal_lahir_ayah_mertua !== undefined
        ? {
            tanggal_lahir_ayah_mertua:
              this.normalizeDate(family.tanggal_lahir_ayah_mertua) ?? null,
          }
        : {}),
      ...(family?.pendidikan_terakhir_ayah_mertua !== undefined
        ? {
            pendidikan_terakhir_ayah_mertua: family.pendidikan_terakhir_ayah_mertua,
          }
        : {}),
      ...(family?.keterangan_ayah_mertua !== undefined
        ? { keterangan_ayah_mertua: family.keterangan_ayah_mertua }
        : {}),
      ...(family?.nama_ibu_mertua !== undefined
        ? { nama_ibu_mertua: family.nama_ibu_mertua }
        : {}),
      ...(family?.tanggal_lahir_ibu_mertua !== undefined
        ? {
            tanggal_lahir_ibu_mertua:
              this.normalizeDate(family.tanggal_lahir_ibu_mertua) ?? null,
          }
        : {}),
      ...(family?.pendidikan_terakhir_ibu_mertua !== undefined
        ? {
            pendidikan_terakhir_ibu_mertua: family.pendidikan_terakhir_ibu_mertua,
          }
        : {}),
      ...(family?.keterangan_ibu_mertua !== undefined
        ? { keterangan_ibu_mertua: family.keterangan_ibu_mertua }
        : {}),
    };
  }

  private buildFamilyPayload(dto: CreateKaryawanDto | UpdateKaryawanDto): EmployeeRecord | undefined {
    const family = dto.family;

    if (!family && dto.nama_pasangan === undefined) {
      return undefined;
    }

    return {
      ...(dto.nama_pasangan !== undefined ? { nama_pasangan: dto.nama_pasangan } : {}),
      ...(family?.tanggal_lahir_pasangan !== undefined
        ? {
            tanggal_lahir_pasangan:
              this.normalizeDate(family.tanggal_lahir_pasangan) ?? null,
          }
        : {}),
      ...(family?.pendidikan_terakhir_pasangan !== undefined
        ? {
            pendidikan_terakhir_pasangan: family.pendidikan_terakhir_pasangan,
          }
        : {}),
      ...(family?.pekerjaan_pasangan !== undefined
        ? { pekerjaan_pasangan: family.pekerjaan_pasangan }
        : {}),
      ...(family?.jumlah_anak !== undefined ? { jumlah_anak: family.jumlah_anak } : {}),
      ...(family?.keterangan_pasangan !== undefined
        ? { keterangan_pasangan: family.keterangan_pasangan }
        : {}),
      ...(family?.anak_ke !== undefined ? { anak_ke: family.anak_ke } : {}),
      ...(family?.jumlah_saudara_kandung !== undefined
        ? { jumlah_saudara_kandung: family.jumlah_saudara_kandung }
        : {}),
      ...(family?.nama_ayah_mertua !== undefined
        ? { nama_ayah_mertua: family.nama_ayah_mertua }
        : {}),
      ...(family?.tanggal_lahir_ayah_mertua !== undefined
        ? {
            tanggal_lahir_ayah_mertua:
              this.normalizeDate(family.tanggal_lahir_ayah_mertua) ?? null,
          }
        : {}),
      ...(family?.pendidikan_terakhir_ayah_mertua !== undefined
        ? {
            pendidikan_terakhir_ayah_mertua: family.pendidikan_terakhir_ayah_mertua,
          }
        : {}),
      ...(family?.keterangan_ayah_mertua !== undefined
        ? { keterangan_ayah_mertua: family.keterangan_ayah_mertua }
        : {}),
      ...(family?.nama_ibu_mertua !== undefined
        ? { nama_ibu_mertua: family.nama_ibu_mertua }
        : {}),
      ...(family?.tanggal_lahir_ibu_mertua !== undefined
        ? {
            tanggal_lahir_ibu_mertua:
              this.normalizeDate(family.tanggal_lahir_ibu_mertua) ?? null,
          }
        : {}),
      ...(family?.pendidikan_terakhir_ibu_mertua !== undefined
        ? {
            pendidikan_terakhir_ibu_mertua: family.pendidikan_terakhir_ibu_mertua,
          }
        : {}),
      ...(family?.keterangan_ibu_mertua !== undefined
        ? { keterangan_ibu_mertua: family.keterangan_ibu_mertua }
        : {}),
    };
  }

  private buildChildrenPayload(dto: CreateKaryawanDto | UpdateKaryawanDto): EmployeeRecord[] | undefined {
    return dto.children?.map((child) => ({
      nama_anak: child.nama_anak,
      jenis_kelamin: child.jenis_kelamin,
      tanggal_lahir: this.normalizeDate(child.tanggal_lahir) ?? null,
      keterangan: child.keterangan,
    }));
  }

  private buildSiblingsPayload(dto: CreateKaryawanDto | UpdateKaryawanDto): EmployeeRecord[] | undefined {
    return dto.siblings?.map((sibling) => ({
      nama_saudara_kandung: sibling.nama_saudara_kandung,
      jenis_kelamin: sibling.jenis_kelamin,
      tanggal_lahir: this.normalizeDate(sibling.tanggal_lahir) ?? null,
      pendidikan_terakhir: sibling.pendidikan_terakhir,
      pekerjaan: sibling.pekerjaan,
      keterangan: sibling.keterangan,
    }));
  }

  private buildEducationsPayload(
    dto: CreateKaryawanDto | UpdateKaryawanDto,
  ): EmployeeRecord[] | undefined {
    const educationsPayload = dto.educations?.map((education) => ({
      tingkat_pendidikan: this.normalizeOptionalText(education.tingkat_pendidikan),
      bidang_studi: this.normalizeOptionalText(education.bidang_studi),
      nama_sekolah: this.normalizeOptionalText(education.nama_sekolah),
      kota_sekolah: this.normalizeOptionalText(education.kota_sekolah),
      status_kelulusan: this.normalizeOptionalText(education.status_kelulusan),
      keterangan: this.normalizeOptionalText(education.keterangan),
    }));

    return educationsPayload?.filter(
      (education) => !this.isEducationPayloadEmpty(education),
    );
  }

  private async buildEducationMutation(
    employeeId: string,
    dto: UpdateKaryawanDto,
  ): Promise<EmployeeRecord | undefined> {
    if (dto.educations === undefined) {
      return undefined;
    }

    const educationsPayload = this.buildEducationsPayload(dto);

    if (dto.educations.length === 0) {
      return {
        deleteMany: {},
      };
    }

    if (!educationsPayload?.length) {
      return undefined;
    }

    const existingEducations = (await this.prisma.employeeEducation.findMany({
      where: {
        employee_id: employeeId,
      },
      select: {
        id: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    })) as ExistingEmployeeEducationRecord[];

    const update = educationsPayload
      .slice(0, existingEducations.length)
      .map((education, index) => ({
        where: {
          id: existingEducations[index].id,
        },
        data: education,
      }));

    const create = educationsPayload.slice(existingEducations.length);

    if (!update.length && !create.length) {
      return undefined;
    }

    return {
      ...(update.length ? { update } : {}),
      ...(create.length ? { create } : {}),
    };
  }

  private async ensureEmployeeExists(id: string): Promise<EmployeeRecord> {
    const employee = await this.employeeModel.findUnique({
      where: { id },
    });

    if (!employee || employee.is_deleted) {
      throw new NotFoundException('Data karyawan tidak ditemukan');
    }

    return employee;
  }

  async findAll(query: KaryawanQueryDto): Promise<PaginatedResponseDto<EmployeeRecord>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = this.buildWhere(query);

    const [total, data] = await Promise.all([
      this.employeeModel.count({ where }),
      this.employeeModel.findMany({
        where,
        include: this.listInclude,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return new PaginatedResponseDto(data, page, limit, total);
  }

  async findOptions(): Promise<EmployeeOptionRecord[]> {
    return (await this.employeeModel.findMany({
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        nama_lengkap: true,
        nomor_induk_karyawan: true,
        status_karyawan: {
          select: {
            nama: true,
            status: true,
          },
        },
        posisi_jabatan: {
          select: {
            nama: true,
            status: true,
          },
        },
      },
      orderBy: [
        {
          nama_lengkap: 'asc',
        },
        {
          nomor_induk_karyawan: 'asc',
        },
      ],
    })) as EmployeeOptionRecord[];
  }

  async findOne(id: string): Promise<EmployeeRecord> {
    const employee = await this.employeeModel.findFirst({
      where: {
        id,
        is_deleted: false,
      },
      include: this.detailInclude,
    });

    if (!employee) {
      throw new NotFoundException('Data karyawan tidak ditemukan');
    }

    return employee;
  }

  async create(dto: CreateKaryawanDto): Promise<EmployeeRecord> {
    await this.validateRelations(dto);

    if (dto.user_id) {
      const existingUserEmployee = await this.employeeModel.findFirst({
        where: {
          user_id: dto.user_id,
          is_deleted: false,
        },
      });

      if (existingUserEmployee) {
        throw new BadRequestException('User sudah terhubung dengan data karyawan lain');
      }
    }

    const qrCode = await QRCode.toDataURL(dto.nomor_induk_karyawan);
    const data = this.buildEmployeeScalarData(dto);
    const familyPayload = this.buildFamilyPayload(dto);
    const childrenPayload = this.buildChildrenPayload(dto);
    const siblingsPayload = this.buildSiblingsPayload(dto);
    const educationsPayload = this.buildEducationsPayload(dto);

    return this.employeeModel.create({
      data: {
        ...data,
        qr_code: qrCode,
        family: familyPayload
          ? {
              create: familyPayload,
            }
          : undefined,
        children: childrenPayload?.length
          ? {
              create: childrenPayload,
            }
          : undefined,
        siblings: siblingsPayload?.length
          ? {
              create: siblingsPayload,
            }
          : undefined,
        educations: educationsPayload?.length
          ? {
              create: educationsPayload,
            }
          : undefined,
      },
      include: this.detailInclude,
    });
  }

  async update(id: string, dto: UpdateKaryawanDto): Promise<EmployeeRecord> {
    await this.ensureEmployeeExists(id);
    await this.validateRelations(dto, id);

    if (dto.user_id) {
      const existingUserEmployee = await this.employeeModel.findFirst({
        where: {
          user_id: dto.user_id,
          is_deleted: false,
          id: {
            not: id,
          },
        },
      });

      if (existingUserEmployee) {
        throw new BadRequestException('User sudah terhubung dengan data karyawan lain');
      }
    }

    const data = this.buildEmployeeScalarData(dto);
    const familyPayload = this.buildFamilyPayload(dto);
    const childrenPayload = this.buildChildrenPayload(dto);
    const siblingsPayload = this.buildSiblingsPayload(dto);
    const educationMutation = await this.buildEducationMutation(id, dto);

    return this.employeeModel.update({
      where: { id },
      data: {
        ...data,
        family: familyPayload
          ? {
              upsert: {
                create: familyPayload,
                update: familyPayload,
              },
            }
          : undefined,
        children: dto.children
          ? {
              deleteMany: {},
              create: childrenPayload ?? [],
            }
          : undefined,
        siblings: dto.siblings
          ? {
              deleteMany: {},
              create: siblingsPayload ?? [],
            }
          : undefined,
        educations: educationMutation,
      },
      include: this.detailInclude,
    });
  }

  async remove(id: string): Promise<EmployeeRecord> {
    await this.ensureEmployeeExists(id);

    return this.employeeModel.update({
      where: { id },
      data: {
        is_deleted: true,
      },
    });
  }

  async uploadFoto(id: string, file: UploadFile): Promise<EmployeeRecord> {
    const employee = await this.ensureEmployeeExists(id);
    const uploadDir = join(process.cwd(), 'uploads', 'foto-karyawan');
    const extension = extname(file.originalname || '') || '.jpg';
    const filename = `${id}_${Date.now()}${extension}`;
    const relativePath = `foto-karyawan/${filename}`;
    const absolutePath = join(uploadDir, filename);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(absolutePath, file.buffer);

    if (employee.foto_karyawan) {
      const oldFilePath = join(process.cwd(), 'uploads', employee.foto_karyawan as string);
      await fs.rm(oldFilePath, { force: true });
    }

    return this.employeeModel.update({
      where: { id },
      data: {
        foto_karyawan: relativePath,
      },
      include: this.detailInclude,
    });
  }

  async generateQrCode(id: string): Promise<EmployeeRecord> {
    const employee = await this.ensureEmployeeExists(id);
    const qrCode = await QRCode.toDataURL(employee.nomor_induk_karyawan as string);

    return {
      id: employee.id,
      nomor_induk_karyawan: employee.nomor_induk_karyawan,
      qr_code: qrCode,
    };
  }
}
