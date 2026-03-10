import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeSiblingDto {
  @IsString()
  nama_saudara_kandung: string;

  @IsOptional()
  @IsString()
  jenis_kelamin?: string;

  @IsOptional()
  @IsDateString()
  tanggal_lahir?: string;

  @IsOptional()
  @IsString()
  pendidikan_terakhir?: string;

  @IsOptional()
  @IsString()
  pekerjaan?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
