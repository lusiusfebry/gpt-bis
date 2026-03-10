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
import { SubGolonganService } from './sub-golongan.service';
import { CreateSubGolonganDto } from './dto/create-sub-golongan.dto';
import { UpdateSubGolonganDto } from './dto/update-sub-golongan.dto';

@Controller('hr/master-data/sub-golongan')
@UseGuards(JwtAuthGuard)
export class SubGolonganController {
  constructor(private readonly subGolonganService: SubGolonganService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.subGolonganService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.subGolonganService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subGolonganService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSubGolonganDto) {
    return this.subGolonganService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubGolonganDto) {
    return this.subGolonganService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subGolonganService.remove(id);
  }
}
