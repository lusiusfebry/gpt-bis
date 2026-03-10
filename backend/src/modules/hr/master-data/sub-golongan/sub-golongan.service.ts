import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateSubGolonganDto } from './dto/create-sub-golongan.dto';
import { UpdateSubGolonganDto } from './dto/update-sub-golongan.dto';

@Injectable()
export class SubGolonganService extends BaseMasterDataService<CreateSubGolonganDto, UpdateSubGolonganDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'subGolongan', 'SGO');
  }
}
