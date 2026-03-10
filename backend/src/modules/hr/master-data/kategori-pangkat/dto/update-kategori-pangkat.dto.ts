import { PartialType } from '@nestjs/mapped-types';

import { CreateKategoriPangkatDto } from './create-kategori-pangkat.dto';

export class UpdateKategoriPangkatDto extends PartialType(CreateKategoriPangkatDto) {}
