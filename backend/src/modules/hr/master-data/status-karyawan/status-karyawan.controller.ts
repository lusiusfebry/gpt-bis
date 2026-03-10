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
import { StatusKaryawanService } from './status-karyawan.service';
import { CreateStatusKaryawanDto } from './dto/create-status-karyawan.dto';
import { UpdateStatusKaryawanDto } from './dto/update-status-karyawan.dto';

@Controller('hr/master-data/status-karyawan')
@UseGuards(JwtAuthGuard)
export class StatusKaryawanController {
  constructor(private readonly statusKaryawanService: StatusKaryawanService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.statusKaryawanService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.statusKaryawanService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusKaryawanService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateStatusKaryawanDto) {
    return this.statusKaryawanService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStatusKaryawanDto) {
    return this.statusKaryawanService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusKaryawanService.remove(id);
  }
}
