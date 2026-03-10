import { PartialType } from '@nestjs/mapped-types';

import { CreatePosisiJabatanDto } from './create-posisi-jabatan.dto';

export class UpdatePosisiJabatanDto extends PartialType(CreatePosisiJabatanDto) {}
