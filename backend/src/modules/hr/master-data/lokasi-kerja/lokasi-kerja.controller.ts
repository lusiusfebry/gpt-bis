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
import { CreateLokasiKerjaDto } from './dto/create-lokasi-kerja.dto';
import { UpdateLokasiKerjaDto } from './dto/update-lokasi-kerja.dto';
import { LokasiKerjaService } from './lokasi-kerja.service';

@Controller('hr/master-data/lokasi-kerja')
@UseGuards(JwtAuthGuard)
export class LokasiKerjaController {
  constructor(private readonly lokasiKerjaService: LokasiKerjaService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.lokasiKerjaService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.lokasiKerjaService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lokasiKerjaService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateLokasiKerjaDto) {
    return this.lokasiKerjaService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLokasiKerjaDto) {
    return this.lokasiKerjaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lokasiKerjaService.remove(id);
  }
}
