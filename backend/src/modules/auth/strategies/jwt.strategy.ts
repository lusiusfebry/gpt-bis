import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  nik: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret', 'changeme'),
    });
  }

  validate(payload: JwtPayload): { userId: string; nomor_induk_karyawan: string } {
    return { userId: payload.sub, nomor_induk_karyawan: payload.nik };
  }
}
