import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByEmail(email);
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.hashedPassword,
      );
      if (isPasswordCorrect) {
        return user;
      }
    }
    return null;
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return await this.jwtService.signAsync(payload);
  }

  async verifyJwt(jwt: string): Promise<User | null> {
    try {
      const payload = await this.jwtService.verifyAsync(jwt);
      const userId = +(payload as JwtPayload).sub;
      return await this.usersService.getUserById(userId);
    } catch (err) {
      return null;
    }
  }
}
