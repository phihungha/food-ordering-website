import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtPayload } from './jwt-payload.model';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  static extractFromCookie(req: Request | undefined): any {
    const jwt = req?.cookies['jwt'];
    return jwt ? jwt : null;
  }

  async validate(payload: JwtPayload): Promise<User> {
    const userId = +payload.sub;
    return await this.authService.getLoggedInUser(userId);
  }
}
