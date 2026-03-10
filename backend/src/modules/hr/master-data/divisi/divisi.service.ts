import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';

@Injectable()
export class DivisiService extends BaseMasterDataService<CreateDivisiDto, UpdateDivisiDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'divisi', 'DIV');
  }
}
