import {
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Controller('/admin')
export class AdminAuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('admin/login')
  async getLoginPage(@Query('signupSucceed') signupSucceed: boolean) {
    return { title: 'Đăng nhập ABC', signupSucceed };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Redirect('/admin')
  async login(@Req() req: Request, @Res() res: Response) {
    const jwt = await this.authService.generateJwt(req.user as User);
    res.cookie('jwt', jwt, { httpOnly: true });
  }

  @Get('logout')
  @Redirect('/admin')
  async logout(@Res() res: Response) {
    res.cookie('jwt', '', { maxAge: 1 });
  }
}
