import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateJenisHubunganKerjaDto } from './dto/create-jenis-hubungan-kerja.dto';
import { UpdateJenisHubunganKerjaDto } from './dto/update-jenis-hubungan-kerja.dto';

@Injectable()
export class JenisHubunganKerjaService extends BaseMasterDataService<CreateJenisHubunganKerjaDto, UpdateJenisHubunganKerjaDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'jenisHubunganKerja', 'JHK');
  }
}
