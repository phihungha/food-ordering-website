import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ProductDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(searchTerm: string | undefined): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      include: { category: true },
    });
  }

  async getPopularProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      include: { category: true },
      orderBy: { buyCount: 'desc' },
      take: 20,
    });
  }

  async getRecentProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      include: { category: true },
      orderBy: { additionDate: 'desc' },
      take: 20,
    });
  }

  async getProductById(id: number, customerId?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        carts: {
          where: { customerId },
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

    return { product, cartQuantity };
  }

  async updateProductsBuyCount(products: number[]) {
    return this.prisma.product.updateMany({
      where: { id: { in: products } },
      data: { buyCount: { increment: 1 } },
    });
  }

  async addProduct(product: ProductDto) {
    return await this.prisma.product.create({
      data: {
        name: product.name,
        imageUrl: product.imageUrl,
        description: product.description,
        category: { connect: { id: product.categoryId } },
        price: product.price,
        unit: product.unit,
      },
    });
  }

  async updateProduct(id: number, product: ProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        imageUrl: product.imageUrl,
        description: product.description,
        category: { connect: { id: product.categoryId } },
        price: product.price,
        unit: product.unit,
      },
    });
  }

  async deleteProduct(id: number) {
    return await this.prisma.product.delete({ where: { id } });
  }
}
