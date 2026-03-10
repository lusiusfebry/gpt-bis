import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateEmployeeFamilyDto {
  @IsOptional()
  @IsString()
  nama_pasangan?: string;

  @IsOptional()
  @IsString()
  tanggal_lahir_pasangan?: string;

  @IsOptional()
  @IsString()
  pendidikan_terakhir_pasangan?: string;

  @IsOptional()
  @IsString()
  pekerjaan_pasangan?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  jumlah_anak?: number;

  @IsOptional()
  @IsString()
  keterangan_pasangan?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  anak_ke?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  jumlah_saudara_kandung?: number;

  @IsOptional()
  @IsString()
  nama_ayah_mertua?: string;

  @IsOptional()
  @IsString()
  tanggal_lahir_ayah_mertua?: string;

  @IsOptional()
  @IsString()
  pendidikan_terakhir_ayah_mertua?: string;

  @IsOptional()
  @IsString()
  keterangan_ayah_mertua?: string;

  @IsOptional()
  @IsString()
  nama_ibu_mertua?: string;

  @IsOptional()
  @IsString()
  tanggal_lahir_ibu_mertua?: string;

  @IsOptional()
  @IsString()
  pendidikan_terakhir_ibu_mertua?: string;

  @IsOptional()
  @IsString()
  keterangan_ibu_mertua?: string;
}
