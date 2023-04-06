import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUser(email);
    if (password === user?.hashedPassword) {
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async generateJwt(user: any): Promise<AuthResponseDto> {
    const payload = { username: user.username, sub: user.id };
    const jwtToken = await this.jwtService.signAsync(payload);
    return { access_token: jwtToken };
  }
}
