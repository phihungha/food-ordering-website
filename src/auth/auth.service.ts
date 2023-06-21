import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { getAuth } from 'firebase-admin/auth';
import { ConfigService } from '@nestjs/config';
import { calcSessionExpireSeconds } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async createSession(idToken: string): Promise<string> {
    const expireHours =
      this.configService.get<number>('SESSION_EXPIRE_HOUR') ?? 24 * 5;
    const expiresIn = calcSessionExpireSeconds(expireHours);
    const sessionOptions = { expiresIn };
    try {
      return await getAuth().createSessionCookie(idToken, sessionOptions);
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  async verifySession(sessionCookie: string): Promise<User | null> {
    const idToken = await getAuth().verifySessionCookie(sessionCookie, true);
    if (idToken.email) {
      return await this.usersService.getUserByEmail(idToken.email);
    }
    return null;
  }
}
