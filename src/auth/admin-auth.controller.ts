import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { calcSessionExpireSeconds } from './utils';
import { ConfigService } from '@nestjs/config';
import { LoginPayload } from './login-payload.model';
import { EmployeeAuthGuard } from './employee-auth.guard';

@Controller('admin')
@UseGuards(EmployeeAuthGuard)
export class AdminAuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('/')
  @Render('admin/homepage')
  async getHomePage() {
    return { title: 'Bảng Admin' };
  }

  @Get('login')
  @Render('admin/login')
  async getLoginPage() {
    return { title: 'Đăng nhập admin ABC' };
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
