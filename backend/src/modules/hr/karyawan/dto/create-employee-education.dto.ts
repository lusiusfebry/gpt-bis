import { IsOptional, IsString } from 'class-validator';

export class CreateEmployeeEducationDto {
  @IsOptional()
  @IsString()
  tingkat_pendidikan?: string;

  @IsOptional()
  @IsString()
  bidang_studi?: string;

  @IsOptional()
  @IsString()
  nama_sekolah?: string;

  @IsOptional()
  @IsString()
  kota_sekolah?: string;

  @IsOptional()
  @IsString()
  status_kelulusan?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
