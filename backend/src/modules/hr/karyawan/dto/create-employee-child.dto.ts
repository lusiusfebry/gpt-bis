import { IsOptional, IsString } from 'class-validator';

export class CreateEmployeeChildDto {
  @IsString()
  nama_anak: string;

  @IsOptional()
  @IsString()
  jenis_kelamin?: string;

  @IsOptional()
  @IsString()
  tanggal_lahir?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
