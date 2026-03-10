import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../common/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

type JwtPayload = {
  sub: string;
  nik: string;
};

type SanitizedUser = Omit<User, 'password' | 'refresh_token'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: SanitizedUser;
  }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        nomor_induk_karyawan: loginDto.nomor_induk_karyawan,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Nomor induk karyawan atau password salah');
    }

    this.ensureUserIsActive(user);

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Nomor induk karyawan atau password salah');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = await this.verifyRefreshToken(refreshTokenDto.refreshToken);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    if (!user.is_active) {
      await this.clearRefreshToken(user.id);
      throw new UnauthorizedException('User tidak aktif');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshTokenDto.refreshToken,
      user.refresh_token,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async profile(userId: string): Promise<SanitizedUser> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    this.ensureUserIsActive(user);

    return this.sanitizeUser(user);
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: null,
      },
    });

    return {
      message: 'Logout berhasil',
    };
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: JwtPayload = {
      sub: user.id,
      nik: user.nomor_induk_karyawan,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwtRefreshSecret', 'changeme-refresh'),
        expiresIn: this.configService.get<string>('jwtRefreshExpiration', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: hashedRefreshToken,
      },
    });
  }

  private async clearRefreshToken(userId: string): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: null,
      },
    });
  }

  private sanitizeUser(user: User): SanitizedUser {
    const sanitizedUser = {
      id: user.id,
      nomor_induk_karyawan: user.nomor_induk_karyawan,
      nama_lengkap: user.nama_lengkap,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return sanitizedUser;
  }

  private ensureUserIsActive(user: User): void {
    if (!user.is_active) {
      throw new UnauthorizedException('User tidak aktif');
    }
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwtRefreshSecret', 'changeme-refresh'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token tidak valid');
    }
  }
}
