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

@Controller('login')
export class CustomerAuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @Render('login')
  async getLogin(@Query('signupSucceed') signupSucceed: boolean) {
    return { title: 'Đăng nhập ABC', signupSucceed };
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  @Redirect('/')
  async login(@Req() req: Request, @Res() res: Response) {
    const jwt = await this.authService.generateJwt(req.user as User);
    res.cookie('jwt', jwt);
  }
}
