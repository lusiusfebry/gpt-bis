import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateKategoriPangkatDto } from './dto/create-kategori-pangkat.dto';
import { UpdateKategoriPangkatDto } from './dto/update-kategori-pangkat.dto';

@Injectable()
export class KategoriPangkatService extends BaseMasterDataService<CreateKategoriPangkatDto, UpdateKategoriPangkatDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'kategoriPangkat', 'KPG');
  }
}
