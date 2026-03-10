import { PartialType } from '@nestjs/mapped-types';
import { IsEmpty, IsOptional } from 'class-validator';

import { CreateKaryawanDto } from './create-karyawan.dto';

export class UpdateKaryawanDto extends PartialType(CreateKaryawanDto) {
  @IsOptional()
  @IsEmpty({ message: 'nomor_induk_karyawan tidak dapat diubah' })
  declare nomor_induk_karyawan?: never;
}
