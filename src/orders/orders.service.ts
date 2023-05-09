import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CartItemDto } from 'src/carts/cart-item.dto';
import { MyCartService } from 'src/carts/my-cart.service';
import { OrderStatusQuery } from './order-status.type';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private myCartService: MyCartService,
  ) {}

  async getMyOrders(
    customerId: number,
    statusFilter: OrderStatusQuery,
  ): Promise<Order[]> {
    let orderStatusFilter;
    switch (statusFilter) {
      case 'pending':
        orderStatusFilter = OrderStatus.Pending;
        break;
      case 'completed':
        orderStatusFilter = OrderStatus.Completed;
        break;
      case 'canceled':
        orderStatusFilter = OrderStatus.Canceled;
        break;
      case 'all':
        orderStatusFilter = undefined;
        break;
      default:
        orderStatusFilter = OrderStatus.Pending;
    }

    return await this.prisma.order.findMany({
      where: {
        customerId,
        status: orderStatusFilter,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getOrderDetails(orderId: number, userId: number): Promise<Order> {
    const result = await this.prisma.order.findMany({
      where: {
        id: orderId,
        customerId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!result.length) {
      throw new NotFoundException('Order not found');
    }

    return result[0];
  }

  generateOrderItems(cartItems: CartItemDto[]) {
    return cartItems.map((i) => {
      const unitPrice = i.product.price;
      const itemPrice = i.product.price.mul(i.quantity);
      return {
        productId: i.productId,
        quantity: i.quantity,
        unitPrice,
        itemPrice,
      };
    });
  }

  async placeOrder(
    deliveryAddress: string,
    customerId: number,
  ): Promise<Order> {
    const cart = await this.myCartService.getCart(customerId);
    const orderItems = this.generateOrderItems(cart.cartItems);

    const newOrder = await this.prisma.$transaction(async (client) => {
      // Create new order
      const order = await client.order.create({
        data: {
          customerId,
          deliveryAddress,
          totalAmount: cart.totalAmount,
          status: OrderStatus.Pending,
          items: { create: orderItems },
        },
      });

      // Update product buy counts
      const productIds = orderItems.map((i) => i.productId);
      await client.product.updateMany({
        where: {
          id: { in: productIds },
        },
        data: {
          buyCount: { increment: 1 },
        },
      });

      // Clear cart
      await client.cartItem.deleteMany({
        where: {
          customerId,
        },
      });

      return order;
    });

    return newOrder;
  }

  async cancelOrder(orderId: number, userId: number): Promise<Order[]> {
    const result = (await this.prisma.order.updateMany({
      where: {
        id: orderId,
        customerId: userId,
        status: OrderStatus.Pending,
      },
      data: {
        status: OrderStatus.Canceled,
        finishedTime: new Date(),
      },
    })) as unknown as Order[];

    if (!result.length) {
      throw new NotFoundException('Order not found');
    }

    return result;
  }
}
