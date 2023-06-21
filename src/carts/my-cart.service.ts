import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CartItemInfoDto } from './cart-item-info.dto';
import { CartItem, Prisma } from '@prisma/client';

@Injectable()
export class MyCartService {
  constructor(private prisma: PrismaService) {}

  async getCart(customerId: string): Promise<CartItemInfoDto> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { customerId },
      include: {
        product: true,
      },
    });

    const totalAmount = cartItems.reduce((sum, item) => {
      const totalPrice = new Prisma.Decimal(item.quantity).mul(
        item.product.price,
      );
      return sum.add(totalPrice);
    }, new Prisma.Decimal(0));

    return { cartItems, totalAmount };
  }

  async addToCart(
    productId: number,
    customerId: string,
    quantity: number,
  ): Promise<CartItem> {
    return await this.prisma.cartItem.upsert({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
      create: {
        customerId,
        productId,
        quantity,
      },
      update: {
        quantity,
      },
    });
  }

  async removeFromCart(
    customerId: string,
    productId: number,
  ): Promise<CartItem> {
    return await this.prisma.cartItem.delete({
      where: {
        customerId_productId: { customerId, productId },
      },
    });
  }

  async clearCart(customerId: string) {
    return await this.prisma.cartItem.deleteMany({
      where: { customerId },
    });
  }
}
