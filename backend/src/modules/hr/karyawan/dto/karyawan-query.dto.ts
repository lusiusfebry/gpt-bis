import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export class KaryawanQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  divisi_id?: string;

  @IsOptional()
  @IsString()
  department_id?: string;

  @IsOptional()
  @IsString()
  status_karyawan_id?: string;

  @IsOptional()
  @IsString()
  lokasi_kerja_id?: string;
}
