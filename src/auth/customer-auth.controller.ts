import { Controller, Get, Post, Render, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './auth-response.dto';
import { User } from '@prisma/client';

@Controller('login')
export class CustomerAuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @Render('login')
  async getLogin() {
    return { title: 'ABC Sign in' };
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req: Request): Promise<AuthResponseDto> {
    return this.authService.generateJwt(req.user as User);
  }
}
