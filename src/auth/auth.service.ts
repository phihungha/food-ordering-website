import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    if (password === user?.hashedPassword) {
      return user;
    }
    return null;
  }

  async getLoggedInUser(userId: number): Promise<User> {
    const user = await this.usersService.getUserById(userId);
    return user!;
  }

  async generateJwt(user: User): Promise<AuthResponseDto> {
    const payload = { email: user.email, sub: user.id };
    const jwtToken = await this.jwtService.signAsync(payload);
    return { access_token: jwtToken };
  }
}
