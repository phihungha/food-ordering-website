import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CustomerDto as CustomerDto } from './customer.dto';
import { Customer, UserType } from '@prisma/client';
import { hashPassword } from 'src/utils/hash-password';

@Injectable()
export class CustomersService {
  constructor(private prismaService: PrismaService) {}

  async getCustomers() {
    return await this.prismaService.customer.findMany({
      include: {
        user: true,
      },
    });
  }

  async createCustomer(customer: CustomerDto): Promise<Customer> {
    const hashedPassword = await hashPassword(customer.password);
    return await this.prismaService.customer.create({
      data: {
        user: {
          create: {
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            hashedPassword: hashedPassword,
            type: UserType.Customer,
          },
        },
      },
      include: { user: true },
    });
  }

  async updateCustomer(
    customerId: number,
    customer: CustomerDto,
  ): Promise<Customer> {
    const hashedPassword = await hashPassword(customer.password);
    return await this.prismaService.customer.update({
      where: { id: customerId },
      data: {
        user: {
          update: {
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            hashedPassword: hashedPassword,
          },
        },
      },
      include: { user: true },
    });
  }
}
