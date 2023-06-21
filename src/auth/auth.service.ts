import { ForbiddenException, Injectable } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';
import { ConfigService } from '@nestjs/config';
import { calcSessionExpireSeconds } from './utils';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

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

  async verifySession(sessionCookie: string) {
    try {
      const idToken = await getAuth().verifySessionCookie(sessionCookie, false);
      return idToken.uid;
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
