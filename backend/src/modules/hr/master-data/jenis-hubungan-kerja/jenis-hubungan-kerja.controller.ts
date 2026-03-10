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
import { JenisHubunganKerjaService } from './jenis-hubungan-kerja.service';
import { CreateJenisHubunganKerjaDto } from './dto/create-jenis-hubungan-kerja.dto';
import { UpdateJenisHubunganKerjaDto } from './dto/update-jenis-hubungan-kerja.dto';

@Controller('hr/master-data/jenis-hubungan-kerja')
@UseGuards(JwtAuthGuard)
export class JenisHubunganKerjaController {
  constructor(private readonly jenisHubunganKerjaService: JenisHubunganKerjaService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.jenisHubunganKerjaService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.jenisHubunganKerjaService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jenisHubunganKerjaService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateJenisHubunganKerjaDto) {
    return this.jenisHubunganKerjaService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJenisHubunganKerjaDto) {
    return this.jenisHubunganKerjaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jenisHubunganKerjaService.remove(id);
  }
}
