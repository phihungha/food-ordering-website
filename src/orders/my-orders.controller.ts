import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Request, Response } from 'express';
import { OrderStatus, User } from '@prisma/client';
import { PlaceOrderDto } from './place-order.dto';
import { OrderStatusQuery } from './order-status.type';
import { UserRoles } from 'src/auth/user-roles.decorator';

@Controller('my-orders')
@UserRoles()
export class MyOrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @Render('my-orders')
  async getMyOrders(
    @Query('status') statusFilter: OrderStatusQuery,
    @Req() req: Request,
  ) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new Error('No current user is provided');
    }
    const orders = await this.ordersService.getMyOrders(
      currentUser.id,
      statusFilter,
    );
    return { title: 'My orders', orders };
  }

  @Get(':id')
  @Render('order-details')
  async getOrderDetails(@Param('id') orderId: number, @Req() req: Request) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new Error('No current user is provided');
    }
    const order = await this.ordersService.getMyOrderDetails(
      orderId,
      currentUser.id,
    );
    return {
      title: `Order #${order.id}`,
      order,
      isCancelable: order.status === OrderStatus.Pending,
    };
  }

  @Post()
  async placeOrder(
    @Body() body: PlaceOrderDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new Error('No current user is provided');
    }
    const order = await this.ordersService.placeOrder(
      body.deliveryAddress,
      currentUser.id,
    );
    res.redirect(`my-orders/${order.id}`);
    return order;
  }

  @Delete(':id')
  async cancelOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @Req() req: Request,
  ) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new Error('No current user is provided');
    }
    return await this.ordersService.cancelMyOrder(orderId, currentUser.id);
  }
}
