import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderStatusQuery } from './order-status.type';
import { OrderUpdateDto } from './update-order.dto';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard)
export class AdminOrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @Render('admin/orders')
  async getOrders(@Query('status') statusFilter: OrderStatusQuery) {
    const orders = await this.ordersService.getOrders(statusFilter);
    return { title: 'All orders', orders };
  }

  @Get(':id')
  @Render('admin/order-details')
  async getOrderDetails(@Param('id') orderId: number) {
    const order = await this.ordersService.getOrderDetails(orderId);
    return {
      title: `Order #${order.id}`,
      order,
      isCancelable: order.status === OrderStatus.Pending,
      isCompletable: order.status === OrderStatus.Completed,
    };
  }

  @Patch(':id')
  async updateOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() body: OrderUpdateDto,
  ) {
    if (body.status === 'completed') {
      return await this.ordersService.completeOrder(orderId);
    } else if (body.status === 'canceled') {
      return await this.ordersService.cancelOrder(orderId);
    }
  }
}
