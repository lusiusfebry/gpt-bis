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
import { DivisiService } from './divisi.service';
import { CreateDivisiDto } from './dto/create-divisi.dto';
import { UpdateDivisiDto } from './dto/update-divisi.dto';

@Controller('hr/master-data/divisi')
@UseGuards(JwtAuthGuard)
export class DivisiController {
  constructor(private readonly divisiService: DivisiService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.divisiService.findAll(query);
  }

  @Get('active')
  findAllActive(@Query('search') search?: string) {
    return this.divisiService.findAllActive(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.divisiService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDivisiDto) {
    return this.divisiService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDivisiDto) {
    return this.divisiService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.divisiService.remove(id);
  }
}
