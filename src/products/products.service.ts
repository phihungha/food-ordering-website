import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }
}
