import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma.service';
import { BaseMasterDataService } from '../base-master-data.service';
import { CreateStatusKaryawanDto } from './dto/create-status-karyawan.dto';
import { UpdateStatusKaryawanDto } from './dto/update-status-karyawan.dto';

@Injectable()
export class StatusKaryawanService extends BaseMasterDataService<CreateStatusKaryawanDto, UpdateStatusKaryawanDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'statusKaryawan', 'STK');
  }
}
