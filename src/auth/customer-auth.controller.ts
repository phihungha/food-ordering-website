import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginPayload } from './login-payload.model';
import { calcSessionExpireSeconds } from './utils';

@Controller()
export class CustomerAuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('login')
  @Render('login')
  async getLoginPage() {
    return { title: 'Đăng nhập ABC' };
  }

  @Post('login')
  @Redirect('/')
  async login(@Body() body: LoginPayload, @Res() res: Response) {
    const sessionCookie = await this.authService.createSession(body.idToken);
    const expireHours =
      this.configService.get<number>('SESSION_EXPIRE_HOUR') ?? 24 * 5;
    const expiresIn = calcSessionExpireSeconds(expireHours);
    res.cookie('session', sessionCookie, {
      httpOnly: true,
      maxAge: expiresIn,
      secure: true,
    });
  }

  @Get('logout')
  @Redirect('/')
  async logout(@Res() res: Response) {
    res.clearCookie('session');
  }
}
