import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './auth-response.dto';
import { User } from '@prisma/client';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req: Request): Promise<AuthResponseDto> {
    return this.authService.generateJwt(req.user as User);
  }
}
