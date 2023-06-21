import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    customerId: string,
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

  async getOrders(statusFilter: OrderStatusQuery): Promise<Order[]> {
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
      where: { status: orderStatusFilter },
      orderBy: { id: 'desc' },
    });
  }

  async getOrderDetails(orderId: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (order === null) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getMyOrderDetails(orderId: number, userId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (order === null || order.customerId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
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
    customerId: string,
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
        where: { id: { in: productIds } },
        data: { buyCount: { increment: 1 } },
      });

      // Clear cart
      await client.cartItem.deleteMany({ where: { customerId } });

      return order;
    });

    return newOrder;
  }

  async cancelOrder(orderId: number): Promise<Order> {
    return await this.prisma.$transaction(async (client) => {
      const order = await client.order.findUnique({ where: { id: orderId } });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.Pending) {
        throw new BadRequestException('Order is not pending');
      }

      return await client.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.Canceled,
          finishedTime: new Date(),
        },
      });
    });
  }

  async cancelMyOrder(orderId: number, userId: string): Promise<Order> {
    return await this.prisma.$transaction(async (client) => {
      const order = await client.order.findUnique({ where: { id: orderId } });

      if (!order || order.customerId !== userId) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.Pending) {
        throw new BadRequestException('Order is not pending');
      }

      return await client.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.Canceled,
          finishedTime: new Date(),
        },
      });
    });
  }

  async completeOrder(orderId: number): Promise<Order> {
    return await this.prisma.$transaction(async (client) => {
      const order = await client.order.findUnique({ where: { id: orderId } });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.Pending) {
        throw new BadRequestException('Order is not pending');
      }

      return await client.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.Completed,
          finishedTime: new Date(),
        },
      });
    });
  }
}
