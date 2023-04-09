import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getProductById(id: number, customerId: number | undefined) {
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

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cartQuantity;
    if (customerId && product.carts[0]?.quantity) {
      cartQuantity = product.carts[0].quantity;
    } else {
      cartQuantity = 1;
    }

    return {
      product,
      cartQuantity,
    };
  }
}
