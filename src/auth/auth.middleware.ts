import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, res: Response, next: () => void) {
    const jwt = req.cookies['jwt'];
    const user = await this.authService.verifyJwt(jwt);
    if (user) {
      req.user = user;
    }
    next();
  }
}
