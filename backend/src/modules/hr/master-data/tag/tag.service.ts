import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService extends BaseMasterDataService<CreateTagDto, UpdateTagDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'tag', 'TAG');
  }
}
