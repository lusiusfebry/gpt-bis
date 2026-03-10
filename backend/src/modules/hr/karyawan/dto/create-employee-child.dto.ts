import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeChildDto {
  @IsString()
  nama_anak: string;

  @IsOptional()
  @IsString()
  jenis_kelamin?: string;

  @IsOptional()
  @IsDateString()
  tanggal_lahir?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
