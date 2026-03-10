import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../../common/prisma.service';

type JwtPayload = {
  sub: string;
  nik: string;
};

type AuthenticatedUser = {
  userId: string;
  nomor_induk_karyawan: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret', 'changeme'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    this.ensureUserIsActive(user);

    return { userId: payload.sub, nomor_induk_karyawan: payload.nik };
  }

  private ensureUserIsActive(user: User): void {
    if (!user.is_active) {
      throw new UnauthorizedException('User tidak aktif');
    }
  }
}
