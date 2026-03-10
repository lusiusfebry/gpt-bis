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
import { GolonganService } from './golongan.service';
import { CreateGolonganDto } from './dto/create-golongan.dto';
import { UpdateGolonganDto } from './dto/update-golongan.dto';

@Controller('hr/master-data/golongan')
@UseGuards(JwtAuthGuard)
export class GolonganController {
  constructor(private readonly golonganService: GolonganService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.golonganService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.golonganService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.golonganService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGolonganDto) {
    return this.golonganService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGolonganDto) {
    return this.golonganService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.golonganService.remove(id);
  }
}
