import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCustomerDto } from './create-customer.dto';
import { UsersService } from '../users/users.service';
import { Customer, UserType } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async getCustomers() {
    return await this.prismaService.customer.findMany({
      include: {
        user: true,
      },
    });
  }

  async createCustomer(newCustomer: CreateCustomerDto): Promise<Customer> {
    const hashedPassword = await this.usersService.hashPassword(
      newCustomer.password,
    );
    return await this.prismaService.customer.create({
      data: {
        user: {
          create: {
            name: newCustomer.name,
            email: newCustomer.email,
            phoneNumber: newCustomer.phoneNumber,
            type: UserType.Customer,
            hashedPassword: hashedPassword,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }
}
