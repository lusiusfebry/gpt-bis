import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateEmployeeChildDto } from './create-employee-child.dto';
import { CreateEmployeeEducationDto } from './create-employee-education.dto';
import { CreateEmployeeFamilyDto } from './create-employee-family.dto';
import { CreateEmployeeSiblingDto } from './create-employee-sibling.dto';

export class CreateKaryawanDto {
  @IsOptional()
  @IsString()
  user_id?: string;

  @IsString()
  @IsNotEmpty()
  nama_lengkap: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^\d{2}-\d{5}$/, {
    message: 'nomor_induk_karyawan harus berformat xx-xxxxx',
  })
  nomor_induk_karyawan: string;

  @IsString()
  @IsNotEmpty()
  divisi_id: string;

  @IsString()
  @IsNotEmpty()
  department_id: string;

  @IsOptional()
  @IsString()
  manager_id?: string;

  @IsOptional()
  @IsString()
  atasan_langsung_id?: string;

  @IsString()
  @IsNotEmpty()
  posisi_jabatan_id: string;

  @IsOptional()
  @IsEmail()
  email_perusahaan?: string;

  @IsOptional()
  @IsString()
  nomor_handphone?: string;

  @IsString()
  @IsNotEmpty()
  status_karyawan_id: string;

  @IsString()
  @IsNotEmpty()
  lokasi_kerja_id: string;

  @IsOptional()
  @IsString()
  tag_id?: string;

  @IsOptional()
  @IsString()
  jenis_kelamin?: string;

  @IsOptional()
  @IsString()
  tempat_lahir?: string;

  @IsOptional()
  @IsDateString()
  tanggal_lahir?: string;

  @IsOptional()
  @IsEmail()
  email_pribadi?: string;

  @IsOptional()
  @IsString()
  agama?: string;

  @IsOptional()
  @IsString()
  golongan_darah?: string;

  @IsOptional()
  @IsString()
  nomor_kartu_keluarga?: string;

  @IsOptional()
  @IsString()
  nomor_ktp?: string;

  @IsOptional()
  @IsString()
  nomor_npwp?: string;

  @IsOptional()
  @IsString()
  nomor_bpjs?: string;

  @IsOptional()
  @IsString()
  no_nik_kk?: string;

  @IsOptional()
  @IsString()
  status_pajak?: string;

  @IsOptional()
  @IsString()
  alamat_domisili?: string;

  @IsOptional()
  @IsString()
  kota_domisili?: string;

  @IsOptional()
  @IsString()
  provinsi_domisili?: string;

  @IsOptional()
  @IsString()
  alamat_ktp?: string;

  @IsOptional()
  @IsString()
  kota_ktp?: string;

  @IsOptional()
  @IsString()
  provinsi_ktp?: string;

  @IsOptional()
  @IsString()
  nomor_handphone_2?: string;

  @IsOptional()
  @IsString()
  nomor_telepon_rumah_1?: string;

  @IsOptional()
  @IsString()
  nomor_telepon_rumah_2?: string;

  @IsOptional()
  @IsString()
  status_pernikahan?: string;

  @IsOptional()
  @IsString()
  nama_pasangan?: string;

  @IsOptional()
  @IsDateString()
  tanggal_menikah?: string;

  @IsOptional()
  @IsDateString()
  tanggal_cerai?: string;

  @IsOptional()
  @IsDateString()
  tanggal_wafat_pasangan?: string;

  @IsOptional()
  @IsString()
  pekerjaan_pasangan?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  jumlah_anak?: number;

  @IsOptional()
  @IsString()
  nomor_rekening?: string;

  @IsOptional()
  @IsString()
  nama_pemegang_rekening?: string;

  @IsOptional()
  @IsString()
  nama_bank?: string;

  @IsOptional()
  @IsString()
  cabang_bank?: string;

  @IsOptional()
  @IsString()
  jenis_hubungan_kerja_id?: string;

  @IsOptional()
  @IsDateString()
  tanggal_masuk_group?: string;

  @IsOptional()
  @IsDateString()
  tanggal_masuk?: string;

  @IsOptional()
  @IsDateString()
  tanggal_permanent?: string;

  @IsOptional()
  @IsDateString()
  tanggal_kontrak?: string;

  @IsOptional()
  @IsDateString()
  tanggal_akhir_kontrak?: string;

  @IsOptional()
  @IsDateString()
  tanggal_berhenti?: string;

  @IsOptional()
  @IsString()
  kategori_pangkat_id?: string;

  @IsOptional()
  @IsString()
  golongan_id?: string;

  @IsOptional()
  @IsString()
  sub_golongan_id?: string;

  @IsOptional()
  @IsString()
  no_dana_pensiun?: string;

  @IsOptional()
  @IsString()
  nama_kontak_darurat_1?: string;

  @IsOptional()
  @IsString()
  nomor_telepon_kontak_darurat_1?: string;

  @IsOptional()
  @IsString()
  hubungan_kontak_darurat_1?: string;

  @IsOptional()
  @IsString()
  alamat_kontak_darurat_1?: string;

  @IsOptional()
  @IsString()
  nama_kontak_darurat_2?: string;

  @IsOptional()
  @IsString()
  nomor_telepon_kontak_darurat_2?: string;

  @IsOptional()
  @IsString()
  hubungan_kontak_darurat_2?: string;

  @IsOptional()
  @IsString()
  alamat_kontak_darurat_2?: string;

  @IsOptional()
  @IsString()
  point_of_original?: string;

  @IsOptional()
  @IsString()
  point_of_hire?: string;

  @IsOptional()
  @IsString()
  ukuran_seragam_kerja?: string;

  @IsOptional()
  @IsString()
  ukuran_sepatu_kerja?: string;

  @IsOptional()
  @IsString()
  lokasi_sebelumnya_id?: string;

  @IsOptional()
  @IsDateString()
  tanggal_mutasi?: string;

  @IsOptional()
  @IsString()
  siklus_pembayaran_gaji?: string;

  @IsOptional()
  @IsString()
  costing?: string;

  @IsOptional()
  @IsString()
  assign?: string;

  @IsOptional()
  @IsString()
  actual?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEmployeeFamilyDto)
  family?: CreateEmployeeFamilyDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeChildDto)
  children?: CreateEmployeeChildDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'siblings maksimal 5 entri' })
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeSiblingDto)
  siblings?: CreateEmployeeSiblingDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeEducationDto)
  educations?: CreateEmployeeEducationDto[];
}
