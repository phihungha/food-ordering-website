import { Controller, Get, Render } from '@nestjs/common';

@Controller('my-orders')
export class MyOrdersController {
  @Get()
  @Render('my-orders')
  getMyOrders() {
    return { title: 'My orders' };
  }
}
