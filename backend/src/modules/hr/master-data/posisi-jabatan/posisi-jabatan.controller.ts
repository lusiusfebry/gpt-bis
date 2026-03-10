import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CreatePosisiJabatanDto } from './dto/create-posisi-jabatan.dto';
import { UpdatePosisiJabatanDto } from './dto/update-posisi-jabatan.dto';
import { PosisiJabatanService } from './posisi-jabatan.service';

@Controller('hr/master-data/posisi-jabatan')
@UseGuards(JwtAuthGuard)
export class PosisiJabatanController {
  constructor(private readonly posisiJabatanService: PosisiJabatanService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.posisiJabatanService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.posisiJabatanService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posisiJabatanService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePosisiJabatanDto) {
    return this.posisiJabatanService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePosisiJabatanDto) {
    return this.posisiJabatanService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posisiJabatanService.remove(id);
  }
}
