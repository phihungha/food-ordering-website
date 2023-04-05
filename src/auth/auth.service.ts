import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUser(email);
    if (password === user?.hashedPassword) {
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }
}
