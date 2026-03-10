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
import { KategoriPangkatService } from './kategori-pangkat.service';
import { CreateKategoriPangkatDto } from './dto/create-kategori-pangkat.dto';
import { UpdateKategoriPangkatDto } from './dto/update-kategori-pangkat.dto';

@Controller('hr/master-data/kategori-pangkat')
@UseGuards(JwtAuthGuard)
export class KategoriPangkatController {
  constructor(private readonly kategoriPangkatService: KategoriPangkatService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.kategoriPangkatService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.kategoriPangkatService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kategoriPangkatService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateKategoriPangkatDto) {
    return this.kategoriPangkatService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKategoriPangkatDto) {
    return this.kategoriPangkatService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kategoriPangkatService.remove(id);
  }
}
