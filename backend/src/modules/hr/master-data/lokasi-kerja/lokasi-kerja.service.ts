import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateLokasiKerjaDto } from './dto/create-lokasi-kerja.dto';
import { UpdateLokasiKerjaDto } from './dto/update-lokasi-kerja.dto';

@Injectable()
export class LokasiKerjaService extends BaseMasterDataService<
  CreateLokasiKerjaDto,
  UpdateLokasiKerjaDto
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'lokasiKerja', 'LKR');
  }
}
