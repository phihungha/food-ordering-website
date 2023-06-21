import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { calcSessionExpireSeconds } from './utils';
import { ConfigService } from '@nestjs/config';
import { LoginPayload } from './login-payload.model';

@Controller('/admin')
export class AdminAuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('login')
  @Render('admin/login')
  async getLoginPage(@Query('signupSucceed') signupSucceed: boolean) {
    return { title: 'Đăng nhập ABC', signupSucceed };
  }

  @Post('login')
  @Redirect('/admin')
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
  @Redirect('/admin')
  async logout(@Res() res: Response) {
    res.clearCookie('session');
  }
}
