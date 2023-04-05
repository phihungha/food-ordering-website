import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUser(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
