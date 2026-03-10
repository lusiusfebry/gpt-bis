import { PartialType } from '@nestjs/mapped-types';

import { CreateStatusKaryawanDto } from './create-status-karyawan.dto';

export class UpdateStatusKaryawanDto extends PartialType(CreateStatusKaryawanDto) {}
