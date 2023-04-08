import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  async getLoggedInUser(userId: number): Promise<User> {
    const user = await this.usersService.getUserById(userId);
    return user!;
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return await this.jwtService.signAsync(payload);
  }
}
