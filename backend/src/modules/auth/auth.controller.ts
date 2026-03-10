import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthenticatedUser = {
  userId: string;
  nomor_induk_karyawan: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.profile(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user.userId);
  }
}
