import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateGolonganDto } from './dto/create-golongan.dto';
import { UpdateGolonganDto } from './dto/update-golongan.dto';

@Injectable()
export class GolonganService extends BaseMasterDataService<CreateGolonganDto, UpdateGolonganDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'golongan', 'GOL');
  }
}
