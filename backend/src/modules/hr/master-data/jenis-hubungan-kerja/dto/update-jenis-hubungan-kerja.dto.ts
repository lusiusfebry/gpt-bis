import { PartialType } from '@nestjs/mapped-types';

import { CreateJenisHubunganKerjaDto } from './create-jenis-hubungan-kerja.dto';

export class UpdateJenisHubunganKerjaDto extends PartialType(CreateJenisHubunganKerjaDto) {}
