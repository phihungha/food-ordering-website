import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Request, Response } from 'express';
import { OrderStatus, User } from '@prisma/client';
import { PlaceOrderDto } from './place-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('my-orders')
@UseGuards(JwtAuthGuard)
export class MyOrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @Render('my-orders')
  async getMyOrders(@Req() req: Request) {
    const currentUser = req.user! as User;
    const orders = await this.ordersService.getMyOrders(currentUser.id);
    return { title: 'My orders', orders };
  }

  @Get(':id')
  @Render('order-details')
  async getOrderDetails(@Param('id') orderId: number, @Req() req: Request) {
    const currentUser = req.user! as User;
    const order = await this.ordersService.getOrderDetails(
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
    const currentUser = req.user! as User;
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
    const currentUser = req.user! as User;
    return await this.ordersService.cancelOrder(orderId, currentUser.id);
  }
}
