import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    const sessionCookie = req.cookies.session;
    if (!sessionCookie) {
      next();
      return;
    }

    const firebaseUid = await this.authService.verifySession(sessionCookie);
    req.firebaseUid = firebaseUid;

    const currentUser = await this.usersService.getUserById(firebaseUid);
    if (currentUser) {
      req.user = currentUser;
    } else {
      req.firebaseUid = firebaseUid;
      if (req.originalUrl !== '/profile/setup') {
        res.redirect('/profile/setup');
        return;
      }
    }

    next();
  }
}
