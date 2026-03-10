import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJenisHubunganKerjaDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsOptional()
  @IsIn(['Aktif', 'Tidak Aktif'])
  status?: string;
}
