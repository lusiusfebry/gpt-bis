import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateKaryawanDto } from './dto/create-karyawan.dto';
import { KaryawanQueryDto } from './dto/karyawan-query.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';
import { KaryawanService } from './karyawan.service';

@Controller('hr/karyawan')
@UseGuards(JwtAuthGuard)
export class KaryawanController {
  constructor(private readonly karyawanService: KaryawanService) {}

  @Get()
  findAll(@Query() query: KaryawanQueryDto) {
    return this.karyawanService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.karyawanService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateKaryawanDto) {
    return this.karyawanService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKaryawanDto) {
    return this.karyawanService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.karyawanService.remove(id);
  }

  @Post(':id/foto')
  @UseInterceptors(FileInterceptor('foto'))
  uploadFoto(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: 'Ukuran file foto maksimal 5MB',
          }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png|webp)$/,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: {
      originalname: string;
      buffer: Buffer;
    },
  ) {
    return this.karyawanService.uploadFoto(id, file);
  }

  @Get(':id/qrcode')
  generateQrCode(@Param('id') id: string) {
    return this.karyawanService.generateQrCode(id);
  }
}
