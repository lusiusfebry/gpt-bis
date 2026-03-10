import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { createReadStream } from 'fs';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ImportExecuteDto } from './dto/import-execute.dto';
import { IMPORT_MAX_FILE_SIZE } from './import-mapping.constants';
import { ImportService } from './import.service';

@Controller('hr/import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('validate')
  @UseInterceptors(FileInterceptor('file'))
  validate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: IMPORT_MAX_FILE_SIZE,
            message: 'Ukuran file import maksimal 10MB',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: {
      originalname: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    },
  ) {
    return this.importService.validate(file);
  }

  @Post('execute')
  execute(@Body() dto: ImportExecuteDto) {
    return this.importService.execute(dto.sessionId);
  }

  @Get('template')
  async template(@Res({ passthrough: true }) response: Response) {
    const templatePath = await this.importService.getTemplatePath();

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="template-import-fix.xlsx"',
    );

    return new StreamableFile(createReadStream(templatePath));
  }
}
