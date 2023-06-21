import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, res: Response, next: () => void) {
    const sessionCookie = req.cookies.session;
    if (sessionCookie) {
      const user = await this.authService.verifySession(sessionCookie);
      if (user) {
        req.user = user;
      }
    }
    next();
  }
}
