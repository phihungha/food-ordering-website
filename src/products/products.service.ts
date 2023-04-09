import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(name: string | undefined): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        name,
      },
      include: {
        category: true,
      },
    });
  }

  async getProductById(id: number, customerId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        carts: {
          where: {
            customerId,
          },
        },
      },
    });
    return {
      product,
      cartQuantity: product?.carts[0].quantity,
    };
  }
}
