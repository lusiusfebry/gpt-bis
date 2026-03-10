import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppModuleService } from './app-module.service';
import { ModuleResponseDto } from './dto/module-response.dto';

@Controller('modules')
@UseGuards(JwtAuthGuard)
export class AppModuleController {
  constructor(private readonly appModuleService: AppModuleService) {}

  @Get()
  findAll(): Promise<ModuleResponseDto[]> {
    return this.appModuleService.findAll();
  }
}
