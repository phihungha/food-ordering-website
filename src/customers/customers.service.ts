import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateCustomerDto as UpdateCustomerDto } from './update-customer.dto';
import { Customer, UserType } from '@prisma/client';
import { getAuth } from 'firebase-admin/auth';
import { AddNewCustomerDto as AddCustomerInfoDto } from './add-customer-info.dto';

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

  /**
   * Add info for a new customer with id
   * that matches the corresponding Firebase user.
   * @param firebaseUid Firebase user ID
   * @param customerInfo Info of the new customer
   * @returns Customer
   */
  async addCustomerInfo(
    firebaseUid: string,
    customerInfo: AddCustomerInfoDto,
  ): Promise<Customer> {
    const firebaseUser = await getAuth().getUser(firebaseUid);

    if (!firebaseUser.email || !firebaseUser.displayName) {
      throw new Error(
        `Firebase user ${firebaseUid} lacks email or/and display name`,
      );
    }

    return await this.prismaService.customer.create({
      data: {
        user: {
          create: {
            id: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            phoneNumber: customerInfo.phoneNumber,
            type: UserType.Customer,
          },
        },
      },
      include: { user: true },
    });
  }

  async updateCustomer(
    customerId: string,
    customer: UpdateCustomerDto,
  ): Promise<Customer> {
    const firebaseUser = await getAuth().updateUser(customerId, {
      displayName: customer.name,
      email: customer.email,
      password: customer.password,
    });

    return await this.prismaService.customer.update({
      where: { id: customerId },
      data: {
        user: {
          update: {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            phoneNumber: customer.phoneNumber,
          },
        },
      },
      include: { user: true },
    });
  }
}
