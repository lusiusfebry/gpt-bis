import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';

import ExcelJS from 'exceljs';
import * as QRCode from 'qrcode';

import { PrismaService } from '../../../common/prisma.service';
import {
  CHILD_GROUP_PREFIXES,
  DATE_IMPORT_FIELDS,
  EDUCATION_GROUP_FIELD_MAP,
  FAMILY_GROUP_FIELD_MAP,
  FIRST_DATA_ROW_INDEX,
  HEADER_ROW_INDEX,
  HEADER_TYPO_NORMALIZATION_MAP,
  IMPORT_ALLOWED_EXTENSIONS,
  IMPORT_HEADER_FIELD_MAP,
  IMPORT_SESSION_TTL_MS,
  IMPORT_SHEET_INDEX,
  ImportDateField,
  ImportMasterLookupField,
  MASTER_LOOKUP_CONFIG,
  MAX_IMPORT_ROWS,
  MAX_SIBLING_GROUP,
  REQUIRED_IMPORT_FIELDS,
  SIBLING_GROUP_PREFIXES,
  TEMPLATE_ASSET_RELATIVE_PATH,
} from './import-mapping.constants';

type UploadFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

type ImportValidationIssue = {
  row: number;
  field: string;
  message: string;
};

type ImportRowCellError = {
  field: string;
  message: string;
};

type MasterLookupRecord = {
  id: string;
  nama: string;
  status?: string;
  divisi_id?: string | null;
  department_id?: string | null;
};

type EmployeeLookupRecord = {
  id: string;
  nama_lengkap: string;
  nomor_induk_karyawan: string;
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

type ImportFamilyPayload = {
  nama_pasangan?: string;
  tanggal_lahir_pasangan?: string;
  pendidikan_terakhir_pasangan?: string;
  pekerjaan_pasangan?: string;
  jumlah_anak?: number;
  keterangan_pasangan?: string;
  anak_ke?: number;
  jumlah_saudara_kandung?: number;
  nama_ayah_mertua?: string;
  tanggal_lahir_ayah_mertua?: string;
  pendidikan_terakhir_ayah_mertua?: string;
  keterangan_ayah_mertua?: string;
  nama_ibu_mertua?: string;
  tanggal_lahir_ibu_mertua?: string;
  pendidikan_terakhir_ibu_mertua?: string;
  keterangan_ibu_mertua?: string;
};

type ImportChildPayload = {
  nama_anak: string;
  jenis_kelamin?: string;
  tanggal_lahir?: string;
  keterangan?: string;
};

type ImportSiblingPayload = {
  nama_saudara_kandung: string;
  jenis_kelamin?: string;
  tanggal_lahir?: string;
  pendidikan_terakhir?: string;
  pekerjaan?: string;
  keterangan?: string;
};

type ImportEducationPayload = {
  tingkat_pendidikan?: string;
  bidang_studi?: string;
  nama_sekolah?: string;
  kota_sekolah?: string;
  status_kelulusan?: string;
  keterangan?: string;
};

type ImportRowPayload = {
  nomor_induk_karyawan: string;
  nama_lengkap: string;
  divisi_id: string;
  department_id: string;
  posisi_jabatan_id: string;
  status_karyawan_id: string;
  lokasi_kerja_id: string;
  manager_id?: string;
  atasan_langsung_id?: string;
  email_perusahaan?: string;
  nomor_handphone?: string;
  tag_id?: string;
  jenis_kelamin?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  email_pribadi?: string;
  agama?: string;
  golongan_darah?: string;
  nomor_kartu_keluarga?: string;
  nomor_ktp?: string;
  nomor_npwp?: string;
  nomor_bpjs?: string;
  no_nik_kk?: string;
  status_pajak?: string;
  alamat_domisili?: string;
  kota_domisili?: string;
  provinsi_domisili?: string;
  alamat_ktp?: string;
  kota_ktp?: string;
  provinsi_ktp?: string;
  nomor_handphone_2?: string;
  nomor_telepon_rumah_1?: string;
  nomor_telepon_rumah_2?: string;
  status_pernikahan?: string;
  nama_pasangan?: string;
  tanggal_menikah?: string;
  tanggal_cerai?: string;
  tanggal_wafat_pasangan?: string;
  pekerjaan_pasangan?: string;
  jumlah_anak?: number;
  nomor_rekening?: string;
  nama_pemegang_rekening?: string;
  nama_bank?: string;
  cabang_bank?: string;
  jenis_hubungan_kerja_id?: string;
  tanggal_masuk_group?: string;
  tanggal_masuk?: string;
  tanggal_permanent?: string;
  tanggal_kontrak?: string;
  tanggal_akhir_kontrak?: string;
  tanggal_berhenti?: string;
  kategori_pangkat_id?: string;
  golongan_id?: string;
  sub_golongan_id?: string;
  no_dana_pensiun?: string;
  nama_kontak_darurat_1?: string;
  nomor_telepon_kontak_darurat_1?: string;
  hubungan_kontak_darurat_1?: string;
  alamat_kontak_darurat_1?: string;
  nama_kontak_darurat_2?: string;
  nomor_telepon_kontak_darurat_2?: string;
  hubungan_kontak_darurat_2?: string;
  alamat_kontak_darurat_2?: string;
  point_of_original?: string;
  point_of_hire?: string;
  ukuran_seragam_kerja?: string;
  ukuran_sepatu_kerja?: string;
  lokasi_sebelumnya_id?: string;
  tanggal_mutasi?: string;
  siklus_pembayaran_gaji?: string;
  costing?: string;
  assign?: string;
  actual?: string;
  family?: ImportFamilyPayload;
  children?: ImportChildPayload[];
  siblings?: ImportSiblingPayload[];
  educations?: ImportEducationPayload[];
};

type ImportPreviewRow = {
  rowNumber: number;
  data: Record<string, unknown>;
};

type ImportValidationRowDetail = {
  rowNumber: number;
  status: 'valid' | 'error';
  rawData: Record<string, unknown>;
  normalizedData?: Partial<ImportRowPayload>;
  errors: ImportRowCellError[];
};

type ImportExecuteRowDetail = {
  rowNumber: number;
  status: 'success' | 'failed';
  rawData: Record<string, unknown>;
  normalizedData?: Partial<ImportRowPayload>;
  nomor_induk_karyawan?: string;
  employeeId?: string;
  message?: string;
  errors: ImportRowCellError[];
};

type ImportSessionRecord = {
  id: string;
  createdAt: number;
  expiresAt: number;
  filename: string;
  totalRows: number;
  validRows: number;
  issues: ImportValidationIssue[];
  payloads: Array<{ rowNumber: number; data: ImportRowPayload }>;
  rows: ImportValidationRowDetail[];
};

type ValidationSummary = {
  sessionId: string;
  filename: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  expiresAt: string;
  issues: ImportValidationIssue[];
  rows: ImportValidationRowDetail[];
};

type ActiveReferenceData = {
  masterData: Record<ImportMasterLookupField, Map<string, MasterLookupRecord>>;
  masterById: Record<ImportMasterLookupField, Map<string, MasterLookupRecord>>;
  employees: Map<string, EmployeeLookupRecord>;
};

@Injectable()
export class ImportService {
  private readonly sessions = new Map<string, ImportSessionRecord>();

  private readonly nikPattern = /^\d{2}-\d{5}$/;

  constructor(private readonly prisma: PrismaService) {}

  private cleanupExpiredSessions(): void {
    const now = Date.now();

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt <= now) {
        this.sessions.delete(sessionId);
      }
    }
  }

  private normalizeHeader(value: unknown): string {
    const rawValue = String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();

    return HEADER_TYPO_NORMALIZATION_MAP[rawValue] ?? rawValue;
  }

  private normalizeLookupKey(value: string): string {
    return value.trim().replace(/\s+/g, ' ').toLowerCase();
  }

  private normalizeText(value: unknown): string | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    const normalized = String(value).replace(/\s+/g, ' ').trim();
    return normalized ? normalized : undefined;
  }

  private normalizeInteger(value: unknown): number | undefined {
    const normalized = this.normalizeText(value);
    if (!normalized) {
      return undefined;
    }

    const parsed = Number(normalized);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException(`Nilai angka tidak valid: ${normalized}`);
    }

    return parsed;
  }

  private normalizeDateValue(value: unknown, field: ImportDateField): string | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new BadRequestException(`Format tanggal ${field} tidak valid`);
      }

      return value.toISOString();
    }

    if (typeof value === 'number') {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const normalizedDate = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);

      if (Number.isNaN(normalizedDate.getTime())) {
        throw new BadRequestException(`Format tanggal ${field} tidak valid`);
      }

      return normalizedDate.toISOString();
    }

    const normalized = this.normalizeText(value);
    if (!normalized) {
      return undefined;
    }

    const directDate = new Date(normalized);
    if (!Number.isNaN(directDate.getTime())) {
      return directDate.toISOString();
    }

    const splitMatch = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (splitMatch) {
      const [, day, month, year] = splitMatch;
      const normalizedYear = year.length === 2 ? `20${year}` : year;
      const parsed = new Date(
        `${normalizedYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`,
      );

      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }

    throw new BadRequestException(`Format tanggal ${field} tidak valid`);
  }

  private extractCellValue(value: ExcelJS.CellValue): unknown {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'object') {
      if ('result' in value) {
        return value.result;
      }

      if ('richText' in value) {
        return value.richText.map((item) => item.text).join('');
      }

      if ('text' in value && typeof value.text === 'string') {
        return value.text;
      }
    }

    return value;
  }

  private async ensureFileExtension(file: UploadFile): Promise<void> {
    const normalizedName = file.originalname.toLowerCase();
    const allowed = IMPORT_ALLOWED_EXTENSIONS.some((extension) =>
      normalizedName.endsWith(extension),
    );

    if (!allowed) {
      throw new BadRequestException('File import harus berformat .xlsx');
    }
  }

  private async preloadReferenceData(): Promise<ActiveReferenceData> {
    const masterData = {} as ActiveReferenceData['masterData'];
    const masterById = {} as ActiveReferenceData['masterById'];
    const masterLookupLoaders = {
      divisi_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.divisi.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
        }));
      },
      department_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.department.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
            divisi_id: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
          ...(record.divisi_id !== undefined ? { divisi_id: record.divisi_id } : {}),
        }));
      },
      posisi_jabatan_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.posisiJabatan.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
            department_id: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
          ...(record.department_id !== undefined
            ? { department_id: record.department_id }
            : {}),
        }));
      },
      status_karyawan_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.statusKaryawan.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
        }));
      },
      lokasi_kerja_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.lokasiKerja.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
        }));
      },
      tag_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.tag.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
        }));
      },
      jenis_hubungan_kerja_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.jenisHubunganKerja.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
        }));
      },
      kategori_pangkat_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.kategoriPangkat.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
        }));
      },
      golongan_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.golongan.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
        }));
      },
      sub_golongan_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.subGolongan.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
        }));
      },
      lokasi_sebelumnya_id: async (): Promise<MasterLookupRecord[]> => {
        const records = await this.prisma.lokasiKerja.findMany({
          where: { status: 'Aktif' },
          select: {
            id: true,
            nama: true,
            status: true,
          },
          orderBy: { nama: 'asc' },
        });

        return records.map((record) => ({
          id: record.id,
          nama: record.nama,
          status: record.status,
        }));
      },
    } satisfies Record<ImportMasterLookupField, () => Promise<MasterLookupRecord[]>>;

    await Promise.all(
      (Object.keys(MASTER_LOOKUP_CONFIG) as ImportMasterLookupField[]).map(async (field) => {
        const records = await masterLookupLoaders[field]();

        masterData[field] = new Map<string, MasterLookupRecord>();
        masterById[field] = new Map<string, MasterLookupRecord>();

        for (const record of records) {
          masterData[field].set(this.normalizeLookupKey(record.nama), record);
          masterById[field].set(record.id, record);
        }
      }),
    );

    const employeeRecords = (await this.prisma.employee.findMany({
      where: {
        is_deleted: false,
        status_karyawan: {
          status: 'Aktif',
          nama: {
            equals: 'Aktif',
            mode: 'insensitive',
          },
        },
      },
      select: {
        id: true,
        nama_lengkap: true,
        nomor_induk_karyawan: true,
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
      orderBy: {
        nama_lengkap: 'asc',
      },
    })) as EmployeeLookupRecord[];

    const employees = new Map<string, EmployeeLookupRecord>();
    for (const employee of employeeRecords) {
      employees.set(this.normalizeLookupKey(employee.nama_lengkap), employee);
    }

    return { masterData, masterById, employees };
  }

  private buildWorksheetHeaderMap(worksheet: ExcelJS.Worksheet): Map<number, string> {
    const headerRow = worksheet.getRow(HEADER_ROW_INDEX);
    const headerMap = new Map<number, string>();

    headerRow.eachCell((cell, columnNumber) => {
      const normalizedHeader = this.normalizeHeader(this.extractCellValue(cell.value));
      const mappedField = IMPORT_HEADER_FIELD_MAP[normalizedHeader];

      if (mappedField) {
        headerMap.set(columnNumber, mappedField);
      }
    });

    return headerMap;
  }

  private buildRawRow(
    worksheet: ExcelJS.Worksheet,
    rowNumber: number,
    headerMap: Map<number, string>,
  ): Record<string, unknown> {
    const rawRow: Record<string, unknown> = {};
    const row = worksheet.getRow(rowNumber);

    headerMap.forEach((field, columnNumber) => {
      rawRow[field] = this.extractCellValue(row.getCell(columnNumber).value);
    });

    return rawRow;
  }

  private async loadParsedWorksheet(file: UploadFile): Promise<{
    workbook: ExcelJS.Workbook;
    worksheet: ExcelJS.Worksheet;
    headerMap: Map<number, string>;
  }> {
    await this.ensureFileExtension(file);

    const workbook = new ExcelJS.Workbook();
    await (workbook.xlsx.load as (input: unknown) => Promise<ExcelJS.Workbook>)(file.buffer);

    const worksheet = workbook.getWorksheet(IMPORT_SHEET_INDEX);
    if (!worksheet) {
      throw new BadRequestException('Worksheet import tidak ditemukan');
    }

    const headerMap = this.buildWorksheetHeaderMap(worksheet);
    if (!headerMap.size) {
      throw new BadRequestException('Header file import tidak dikenali');
    }

    return { workbook, worksheet, headerMap };
  }

  private collectPreviewRows(
    worksheet: ExcelJS.Worksheet,
    headerMap: Map<number, string>,
  ): ImportPreviewRow[] {
    const rows: ImportPreviewRow[] = [];
    const lastRowNumber = Math.min(worksheet.rowCount, FIRST_DATA_ROW_INDEX + MAX_IMPORT_ROWS - 1);

    for (let rowNumber = FIRST_DATA_ROW_INDEX; rowNumber <= lastRowNumber; rowNumber += 1) {
      const rawRow = this.buildRawRow(worksheet, rowNumber, headerMap);

      if (this.isEmptyRow(rawRow)) {
        continue;
      }

      rows.push({
        rowNumber,
        data: rawRow,
      });
    }

    return rows;
  }

  private isEmptyRow(rawRow: Record<string, unknown>): boolean {
    return Object.values(rawRow).every((value) => this.normalizeText(value) === undefined);
  }

  private addIssue(
    issues: ImportValidationIssue[],
    row: number,
    field: string,
    message: string,
  ): void {
    issues.push({ row, field, message });
  }

  private resolveMasterLookup(
    field: ImportMasterLookupField,
    value: string,
    references: ActiveReferenceData,
  ): string {
    const record = references.masterData[field].get(this.normalizeLookupKey(value));

    if (!record) {
      throw new BadRequestException(
        `${MASTER_LOOKUP_CONFIG[field].label} dengan nama "${value}" tidak ditemukan atau tidak aktif`,
      );
    }

    return record.id;
  }

  private resolveEmployeeLookup(
    field: 'manager_id' | 'atasan_langsung_id',
    value: string,
    references: ActiveReferenceData,
  ): string {
    const employee = references.employees.get(this.normalizeLookupKey(value));

    if (!employee) {
      throw new BadRequestException(
        field === 'manager_id' ? 'Manager tidak ditemukan' : 'Atasan langsung tidak ditemukan',
      );
    }

    if (
      field === 'manager_id' &&
      (!employee.posisi_jabatan ||
        employee.posisi_jabatan.status !== 'Aktif' ||
        !employee.posisi_jabatan.nama.toLowerCase().includes('head'))
    ) {
      throw new BadRequestException('Manager harus karyawan aktif dengan posisi head');
    }

    return employee.id;
  }

  private buildFamilyPayload(rawRow: Record<string, unknown>): ImportFamilyPayload | undefined {
    const familyPayload: ImportFamilyPayload = {};

    for (const [field, target] of Object.entries(FAMILY_GROUP_FIELD_MAP)) {
      const rawValue = rawRow[field];

      if ((DATE_IMPORT_FIELDS as readonly string[]).includes(field)) {
        const normalizedDate = this.normalizeDateValue(rawValue, field as ImportDateField);
        if (normalizedDate) {
          familyPayload[target as keyof ImportFamilyPayload] = normalizedDate as never;
        }
        continue;
      }

      if (field === 'jumlah_anak' || field === 'anak_ke' || field === 'jumlah_saudara_kandung') {
        const normalizedNumber = this.normalizeInteger(rawValue);
        if (normalizedNumber !== undefined) {
          familyPayload[target as keyof ImportFamilyPayload] = normalizedNumber as never;
        }
        continue;
      }

      const normalizedText = this.normalizeText(rawValue);
      if (normalizedText !== undefined) {
        familyPayload[target as keyof ImportFamilyPayload] = normalizedText as never;
      }
    }

    return Object.keys(familyPayload).length ? familyPayload : undefined;
  }

  private buildChildrenPayload(rawRow: Record<string, unknown>): ImportChildPayload[] | undefined {
    const indexes = new Set<number>();

    for (const key of Object.keys(rawRow)) {
      const match = key.match(/^nama_anak_(\d+)$/);
      if (match) {
        indexes.add(Number(match[1]));
      }
    }

    const children = Array.from(indexes)
      .sort((a, b) => a - b)
      .reduce<ImportChildPayload[]>((items, index) => {
        const name = this.normalizeText(rawRow[`${CHILD_GROUP_PREFIXES.nama_anak}_${index}`]);
        if (!name) {
          return items;
        }

        items.push({
          nama_anak: name,
          jenis_kelamin: this.normalizeText(
            rawRow[`${CHILD_GROUP_PREFIXES.jenis_kelamin}_${index}`],
          ),
          tanggal_lahir: this.normalizeDateValue(
            rawRow[`${CHILD_GROUP_PREFIXES.tanggal_lahir}_${index}`],
            'tanggal_lahir',
          ),
          keterangan: this.normalizeText(rawRow[`${CHILD_GROUP_PREFIXES.keterangan}_${index}`]),
        });

        return items;
      }, []);

    return children.length ? children : undefined;
  }

  private buildSiblingsPayload(rawRow: Record<string, unknown>): ImportSiblingPayload[] | undefined {
    const siblings: ImportSiblingPayload[] = [];

    for (let index = 1; index <= MAX_SIBLING_GROUP; index += 1) {
      const name = this.normalizeText(rawRow[`${SIBLING_GROUP_PREFIXES.nama_saudara_kandung}_${index}`]);
      if (!name) {
        continue;
      }

      siblings.push({
        nama_saudara_kandung: name,
        jenis_kelamin: this.normalizeText(
          rawRow[`${SIBLING_GROUP_PREFIXES.jenis_kelamin}_${index}`],
        ),
        tanggal_lahir: this.normalizeDateValue(
          rawRow[`${SIBLING_GROUP_PREFIXES.tanggal_lahir}_${index}`],
          'tanggal_lahir',
        ),
        pendidikan_terakhir: this.normalizeText(
          rawRow[`${SIBLING_GROUP_PREFIXES.pendidikan_terakhir}_${index}`],
        ),
        pekerjaan: this.normalizeText(rawRow[`${SIBLING_GROUP_PREFIXES.pekerjaan}_${index}`]),
        keterangan: this.normalizeText(rawRow[`${SIBLING_GROUP_PREFIXES.keterangan}_${index}`]),
      });
    }

    return siblings.length ? siblings : undefined;
  }

  private buildEducationsPayload(
    rawRow: Record<string, unknown>,
  ): ImportEducationPayload[] | undefined {
    const educationPayload: ImportEducationPayload = {};

    for (const [field, target] of Object.entries(EDUCATION_GROUP_FIELD_MAP)) {
      const normalizedText = this.normalizeText(rawRow[field]);
      if (normalizedText !== undefined) {
        educationPayload[target as keyof ImportEducationPayload] = normalizedText as never;
      }
    }

    return Object.keys(educationPayload).length ? [educationPayload] : undefined;
  }

  private mapRowToPayload(
    rawRow: Record<string, unknown>,
    references: ActiveReferenceData,
  ): ImportRowPayload {
    const payload: Partial<ImportRowPayload> = {};

    for (const [field, rawValue] of Object.entries(rawRow)) {
      if ((DATE_IMPORT_FIELDS as readonly string[]).includes(field)) {
        const normalizedDate = this.normalizeDateValue(rawValue, field as ImportDateField);
        if (normalizedDate) {
          payload[field as keyof ImportRowPayload] = normalizedDate as never;
        }
        continue;
      }

      if (field in MASTER_LOOKUP_CONFIG) {
        const normalizedText = this.normalizeText(rawValue);
        if (normalizedText) {
          payload[field as keyof ImportRowPayload] = this.resolveMasterLookup(
            field as ImportMasterLookupField,
            normalizedText,
            references,
          ) as never;
        }
        continue;
      }

      if (field === 'manager_id' || field === 'atasan_langsung_id') {
        const normalizedText = this.normalizeText(rawValue);
        if (normalizedText) {
          payload[field] = this.resolveEmployeeLookup(field, normalizedText, references) as never;
        }
        continue;
      }

      if (field === 'jumlah_anak') {
        const normalizedNumber = this.normalizeInteger(rawValue);
        if (normalizedNumber !== undefined) {
          payload.jumlah_anak = normalizedNumber;
        }
        continue;
      }

      if (field === 'anak_ke' || field === 'jumlah_saudara_kandung') {
        continue;
      }

      const normalizedText = this.normalizeText(rawValue);
      if (normalizedText !== undefined) {
        payload[field as keyof ImportRowPayload] = normalizedText as never;
      }
    }

    payload.family = this.buildFamilyPayload(rawRow);
    payload.children = this.buildChildrenPayload(rawRow);
    payload.siblings = this.buildSiblingsPayload(rawRow);
    payload.educations = this.buildEducationsPayload(rawRow);

    return payload as ImportRowPayload;
  }

  private validateRequiredFields(
    rowNumber: number,
    payload: Partial<ImportRowPayload>,
    issues: ImportValidationIssue[],
  ): void {
    for (const field of REQUIRED_IMPORT_FIELDS) {
      if (!payload[field]) {
        this.addIssue(issues, rowNumber, field, `${field} wajib diisi`);
      }
    }
  }

  private validateNikFormat(
    rowNumber: number,
    payload: Partial<ImportRowPayload>,
    issues: ImportValidationIssue[],
  ): void {
    if (!payload.nomor_induk_karyawan) {
      return;
    }

    if (!this.nikPattern.test(payload.nomor_induk_karyawan)) {
      this.addIssue(
        issues,
        rowNumber,
        'nomor_induk_karyawan',
        'nomor_induk_karyawan harus berformat xx-xxxxx',
      );
    }
  }

  private validateRelationConsistency(
    rowNumber: number,
    payload: Partial<ImportRowPayload>,
    references: ActiveReferenceData,
    issues: ImportValidationIssue[],
  ): void {
    const department = payload.department_id
      ? references.masterById.department_id.get(payload.department_id)
      : undefined;
    const posisiJabatan = payload.posisi_jabatan_id
      ? references.masterById.posisi_jabatan_id.get(payload.posisi_jabatan_id)
      : undefined;

    if (department && payload.divisi_id && department.divisi_id !== payload.divisi_id) {
      this.addIssue(
        issues,
        rowNumber,
        'department_id',
        'Department tidak sesuai dengan divisi yang dipilih',
      );
    }

    if (
      posisiJabatan &&
      payload.department_id &&
      posisiJabatan.department_id !== payload.department_id
    ) {
      this.addIssue(
        issues,
        rowNumber,
        'posisi_jabatan_id',
        'Posisi jabatan tidak sesuai dengan department yang dipilih',
      );
    }
  }

  private async validateUniqueNikInDatabase(
    rowEntries: Array<{ rowNumber: number; data: ImportRowPayload }>,
    issues: ImportValidationIssue[],
  ): Promise<void> {
    const nikes = rowEntries.map((entry) => entry.data.nomor_induk_karyawan);
    if (!nikes.length) {
      return;
    }

    const existingEmployees = await this.prisma.employee.findMany({
      where: {
        is_deleted: false,
        nomor_induk_karyawan: {
          in: nikes,
        },
      },
      select: {
        nomor_induk_karyawan: true,
      },
    });

    const rowMap = new Map(rowEntries.map((entry) => [entry.data.nomor_induk_karyawan, entry.rowNumber]));

    for (const employee of existingEmployees) {
      const nik = employee.nomor_induk_karyawan;
      const rowNumber = rowMap.get(nik);

      if (rowNumber) {
        this.addIssue(issues, rowNumber, 'nomor_induk_karyawan', 'NIK sudah terdaftar di database');
      }
    }
  }

  private buildRowErrors(
    rowNumber: number,
    issues: ImportValidationIssue[],
  ): ImportRowCellError[] {
    return issues
      .filter((issue) => issue.row === rowNumber)
      .map((issue) => ({
        field: issue.field,
        message: issue.message,
      }));
  }

  private buildValidationRows(
    snapshots: Array<{
      rowNumber: number;
      rawData: Record<string, unknown>;
      normalizedData?: Partial<ImportRowPayload>;
    }>,
    issues: ImportValidationIssue[],
  ): ImportValidationRowDetail[] {
    return snapshots.map((snapshot) => {
      const errors = this.buildRowErrors(snapshot.rowNumber, issues);

      return {
        rowNumber: snapshot.rowNumber,
        status: errors.length ? 'error' : 'valid',
        rawData: snapshot.rawData,
        normalizedData: snapshot.normalizedData,
        errors,
      };
    });
  }

  private buildSessionRecord(
    file: UploadFile,
    payloads: Array<{ rowNumber: number; data: ImportRowPayload }>,
    issues: ImportValidationIssue[],
    totalRows: number,
    rows: ImportValidationRowDetail[],
  ): ImportSessionRecord {
    const createdAt = Date.now();

    return {
      id: randomUUID(),
      createdAt,
      expiresAt: createdAt + IMPORT_SESSION_TTL_MS,
      filename: file.originalname,
      totalRows,
      validRows: payloads.length,
      issues,
      payloads,
      rows,
    };
  }

  async upload(file: UploadFile): Promise<{
    filename: string;
    totalRows: number;
    rows: ImportPreviewRow[];
  }> {
    this.cleanupExpiredSessions();
    const { worksheet, headerMap } = await this.loadParsedWorksheet(file);
    const rows = this.collectPreviewRows(worksheet, headerMap);

    return {
      filename: file.originalname,
      totalRows: rows.length,
      rows,
    };
  }

  async validate(file: UploadFile): Promise<ValidationSummary> {
    this.cleanupExpiredSessions();
    const { worksheet, headerMap } = await this.loadParsedWorksheet(file);

    const references = await this.preloadReferenceData();
    const issues: ImportValidationIssue[] = [];
    const rowEntries: Array<{ rowNumber: number; data: ImportRowPayload }> = [];
    const rowSnapshots: Array<{
      rowNumber: number;
      rawData: Record<string, unknown>;
      normalizedData?: Partial<ImportRowPayload>;
    }> = [];
    const nikSet = new Set<string>();
    let totalRows = 0;

    const lastRowNumber = Math.min(worksheet.rowCount, FIRST_DATA_ROW_INDEX + MAX_IMPORT_ROWS - 1);

    for (let rowNumber = FIRST_DATA_ROW_INDEX; rowNumber <= lastRowNumber; rowNumber += 1) {
      const rawRow = this.buildRawRow(worksheet, rowNumber, headerMap);

      if (this.isEmptyRow(rawRow)) {
        continue;
      }

      totalRows += 1;

      try {
        const payload = this.mapRowToPayload(rawRow, references);
        rowSnapshots.push({
          rowNumber,
          rawData: rawRow,
          normalizedData: payload,
        });
        this.validateRequiredFields(rowNumber, payload, issues);
        this.validateNikFormat(rowNumber, payload, issues);
        this.validateRelationConsistency(rowNumber, payload, references, issues);

        if (payload.nomor_induk_karyawan) {
          if (nikSet.has(payload.nomor_induk_karyawan)) {
            this.addIssue(issues, rowNumber, 'nomor_induk_karyawan', 'NIK duplikat di file import');
          } else {
            nikSet.add(payload.nomor_induk_karyawan);
          }
        }

        const hasIssue = issues.some((issue) => issue.row === rowNumber);
        if (!hasIssue) {
          rowEntries.push({ rowNumber, data: payload });
        }
      } catch (error) {
        rowSnapshots.push({
          rowNumber,
          rawData: rawRow,
        });

        const message =
          error instanceof BadRequestException
            ? (error.getResponse() as { message?: string | string[] }).message
            : 'Baris import tidak valid';
        const normalizedMessage = Array.isArray(message)
          ? message.join(', ')
          : (message ?? 'Baris import tidak valid');

        this.addIssue(issues, rowNumber, 'row', normalizedMessage);
      }
    }

    await this.validateUniqueNikInDatabase(rowEntries, issues);

    const invalidRows = new Set(issues.map((issue) => issue.row));
    const validEntries = rowEntries.filter((entry) => !invalidRows.has(entry.rowNumber));
    const rows = this.buildValidationRows(rowSnapshots, issues);
    const session = this.buildSessionRecord(file, validEntries, issues, totalRows, rows);
    this.sessions.set(session.id, session);

    return {
      sessionId: session.id,
      filename: session.filename,
      totalRows: session.totalRows,
      validRows: session.validRows,
      invalidRows: invalidRows.size,
      expiresAt: new Date(session.expiresAt).toISOString(),
      issues: session.issues,
      rows: session.rows,
    };
  }

  async execute(sessionId: string) {
    this.cleanupExpiredSessions();

    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException('Sesi import tidak ditemukan atau sudah kedaluwarsa');
    }

    const details: ImportExecuteRowDetail[] = session.rows
      .filter((row) => row.status === 'error')
      .map((row) => ({
        rowNumber: row.rowNumber,
        status: 'failed',
        rawData: row.rawData,
        normalizedData: row.normalizedData,
        nomor_induk_karyawan: row.normalizedData?.nomor_induk_karyawan,
        message: 'Baris gagal divalidasi',
        errors: row.errors,
      }));

    for (const entry of session.payloads) {
      const payload = entry.data;
      const sessionRow = session.rows.find((row) => row.rowNumber === entry.rowNumber);

      try {
        const qrCode = await QRCode.toDataURL(payload.nomor_induk_karyawan);
        const employee = await this.prisma.employee.create({
          data: {
            nomor_induk_karyawan: payload.nomor_induk_karyawan,
            nama_lengkap: payload.nama_lengkap,
            divisi_id: payload.divisi_id,
            department_id: payload.department_id,
            manager_id: payload.manager_id,
            atasan_langsung_id: payload.atasan_langsung_id,
            posisi_jabatan_id: payload.posisi_jabatan_id,
            email_perusahaan: payload.email_perusahaan,
            nomor_handphone: payload.nomor_handphone,
            nomor_handphone_1: payload.nomor_handphone,
            status_karyawan_id: payload.status_karyawan_id,
            lokasi_kerja_id: payload.lokasi_kerja_id,
            tag_id: payload.tag_id,
            jenis_kelamin: payload.jenis_kelamin,
            tempat_lahir: payload.tempat_lahir,
            tanggal_lahir: payload.tanggal_lahir ? new Date(payload.tanggal_lahir) : undefined,
            email_pribadi: payload.email_pribadi,
            agama: payload.agama,
            golongan_darah: payload.golongan_darah,
            nomor_kartu_keluarga: payload.nomor_kartu_keluarga,
            nomor_ktp: payload.nomor_ktp,
            nomor_npwp: payload.nomor_npwp,
            nomor_bpjs: payload.nomor_bpjs,
            no_nik_kk: payload.no_nik_kk,
            status_pajak: payload.status_pajak,
            alamat_domisili: payload.alamat_domisili,
            kota_domisili: payload.kota_domisili,
            provinsi_domisili: payload.provinsi_domisili,
            alamat_ktp: payload.alamat_ktp,
            kota_ktp: payload.kota_ktp,
            provinsi_ktp: payload.provinsi_ktp,
            nomor_handphone_2: payload.nomor_handphone_2,
            nomor_telepon_rumah_1: payload.nomor_telepon_rumah_1,
            nomor_telepon_rumah_2: payload.nomor_telepon_rumah_2,
            status_pernikahan: payload.status_pernikahan,
            nama_pasangan: payload.nama_pasangan,
            tanggal_menikah: payload.tanggal_menikah ? new Date(payload.tanggal_menikah) : undefined,
            tanggal_cerai: payload.tanggal_cerai ? new Date(payload.tanggal_cerai) : undefined,
            tanggal_wafat_pasangan: payload.tanggal_wafat_pasangan
              ? new Date(payload.tanggal_wafat_pasangan)
              : undefined,
            pekerjaan_pasangan: payload.pekerjaan_pasangan,
            jumlah_anak: payload.jumlah_anak,
            nomor_rekening: payload.nomor_rekening,
            nama_pemegang_rekening: payload.nama_pemegang_rekening,
            nama_bank: payload.nama_bank,
            cabang_bank: payload.cabang_bank,
            jenis_hubungan_kerja_id: payload.jenis_hubungan_kerja_id,
            tanggal_masuk_group: payload.tanggal_masuk_group
              ? new Date(payload.tanggal_masuk_group)
              : undefined,
            tanggal_masuk: payload.tanggal_masuk ? new Date(payload.tanggal_masuk) : undefined,
            tanggal_permanent: payload.tanggal_permanent
              ? new Date(payload.tanggal_permanent)
              : undefined,
            tanggal_kontrak: payload.tanggal_kontrak ? new Date(payload.tanggal_kontrak) : undefined,
            tanggal_akhir_kontrak: payload.tanggal_akhir_kontrak
              ? new Date(payload.tanggal_akhir_kontrak)
              : undefined,
            tanggal_berhenti: payload.tanggal_berhenti
              ? new Date(payload.tanggal_berhenti)
              : undefined,
            kategori_pangkat_id: payload.kategori_pangkat_id,
            golongan_id: payload.golongan_id,
            sub_golongan_id: payload.sub_golongan_id,
            no_dana_pensiun: payload.no_dana_pensiun,
            nama_kontak_darurat_1: payload.nama_kontak_darurat_1,
            nomor_telepon_kontak_darurat_1: payload.nomor_telepon_kontak_darurat_1,
            hubungan_kontak_darurat_1: payload.hubungan_kontak_darurat_1,
            alamat_kontak_darurat_1: payload.alamat_kontak_darurat_1,
            nama_kontak_darurat_2: payload.nama_kontak_darurat_2,
            nomor_telepon_kontak_darurat_2: payload.nomor_telepon_kontak_darurat_2,
            hubungan_kontak_darurat_2: payload.hubungan_kontak_darurat_2,
            alamat_kontak_darurat_2: payload.alamat_kontak_darurat_2,
            point_of_original: payload.point_of_original,
            point_of_hire: payload.point_of_hire,
            ukuran_seragam_kerja: payload.ukuran_seragam_kerja,
            ukuran_sepatu_kerja: payload.ukuran_sepatu_kerja,
            lokasi_sebelumnya_id: payload.lokasi_sebelumnya_id,
            tanggal_mutasi: payload.tanggal_mutasi ? new Date(payload.tanggal_mutasi) : undefined,
            siklus_pembayaran_gaji: payload.siklus_pembayaran_gaji,
            costing: payload.costing,
            assign: payload.assign,
            actual: payload.actual,
            tanggal_lahir_pasangan: payload.family?.tanggal_lahir_pasangan
              ? new Date(payload.family.tanggal_lahir_pasangan)
              : undefined,
            pendidikan_terakhir_pasangan: payload.family?.pendidikan_terakhir_pasangan,
            keterangan_pasangan: payload.family?.keterangan_pasangan,
            anak_ke: payload.family?.anak_ke,
            jumlah_saudara_kandung: payload.family?.jumlah_saudara_kandung,
            nama_ayah_mertua: payload.family?.nama_ayah_mertua,
            tanggal_lahir_ayah_mertua: payload.family?.tanggal_lahir_ayah_mertua
              ? new Date(payload.family.tanggal_lahir_ayah_mertua)
              : undefined,
            pendidikan_terakhir_ayah_mertua: payload.family?.pendidikan_terakhir_ayah_mertua,
            keterangan_ayah_mertua: payload.family?.keterangan_ayah_mertua,
            nama_ibu_mertua: payload.family?.nama_ibu_mertua,
            tanggal_lahir_ibu_mertua: payload.family?.tanggal_lahir_ibu_mertua
              ? new Date(payload.family.tanggal_lahir_ibu_mertua)
              : undefined,
            pendidikan_terakhir_ibu_mertua: payload.family?.pendidikan_terakhir_ibu_mertua,
            keterangan_ibu_mertua: payload.family?.keterangan_ibu_mertua,
            qr_code: qrCode,
            family: payload.family
              ? {
                  create: {
                    ...payload.family,
                    tanggal_lahir_pasangan: payload.family.tanggal_lahir_pasangan
                      ? new Date(payload.family.tanggal_lahir_pasangan)
                      : undefined,
                    tanggal_lahir_ayah_mertua: payload.family.tanggal_lahir_ayah_mertua
                      ? new Date(payload.family.tanggal_lahir_ayah_mertua)
                      : undefined,
                    tanggal_lahir_ibu_mertua: payload.family.tanggal_lahir_ibu_mertua
                      ? new Date(payload.family.tanggal_lahir_ibu_mertua)
                      : undefined,
                  },
                }
              : undefined,
            children: payload.children?.length
              ? {
                  create: payload.children.map((child) => ({
                    nama_anak: child.nama_anak,
                    jenis_kelamin: child.jenis_kelamin,
                    tanggal_lahir: child.tanggal_lahir ? new Date(child.tanggal_lahir) : undefined,
                    keterangan: child.keterangan,
                  })),
                }
              : undefined,
            siblings: payload.siblings?.length
              ? {
                  create: payload.siblings.map((sibling) => ({
                    nama_saudara_kandung: sibling.nama_saudara_kandung,
                    jenis_kelamin: sibling.jenis_kelamin,
                    tanggal_lahir: sibling.tanggal_lahir
                      ? new Date(sibling.tanggal_lahir)
                      : undefined,
                    pendidikan_terakhir: sibling.pendidikan_terakhir,
                    pekerjaan: sibling.pekerjaan,
                    keterangan: sibling.keterangan,
                  })),
                }
              : undefined,
            educations: payload.educations?.length
              ? {
                  create: payload.educations,
                }
              : undefined,
          },
        });

        details.push({
          rowNumber: entry.rowNumber,
          status: 'success',
          rawData: sessionRow?.rawData ?? {},
          normalizedData: payload,
          nomor_induk_karyawan: payload.nomor_induk_karyawan,
          employeeId: employee.id,
          message: 'Baris berhasil diimport',
          errors: [],
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Baris gagal diproses saat execute import';

        details.push({
          rowNumber: entry.rowNumber,
          status: 'failed',
          rawData: sessionRow?.rawData ?? {},
          normalizedData: payload,
          nomor_induk_karyawan: payload.nomor_induk_karyawan,
          message,
          errors: [
            {
              field: 'row',
              message,
            },
          ],
        });
      }
    }

    details.sort((left, right) => left.rowNumber - right.rowNumber);
    this.sessions.delete(sessionId);

    const success = details.filter((detail) => detail.status === 'success').length;
    const failed = details.length - success;

    return {
      sessionId: session.id,
      processed: session.totalRows,
      success,
      failed,
      details,
    };
  }

  async getTemplatePath(): Promise<string> {
    const templatePath = join(process.cwd(), TEMPLATE_ASSET_RELATIVE_PATH);
    await fs.access(templatePath);
    return templatePath;
  }
}
