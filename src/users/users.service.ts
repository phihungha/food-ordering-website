import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUserById(id: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        employee: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        customer: true,
        employee: true,
      },
    });
  }
}
