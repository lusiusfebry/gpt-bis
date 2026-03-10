import { PartialType } from '@nestjs/mapped-types';

import { CreateSubGolonganDto } from './create-sub-golongan.dto';

export class UpdateSubGolonganDto extends PartialType(CreateSubGolonganDto) {}
