import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

async function getUserById(prismaService: PrismaService, id: string) {
  return await prismaService.user.findUnique({
    where: { id },
    include: {
      customer: true,
      employee: true,
    },
  });
}

export type UserWithRoleSpecificInfo = Prisma.PromiseReturnType<
  typeof getUserById
>;

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUserById(id: string) {
    return await getUserById(this.prismaService, id);
  }
}
