import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MyOrdersController } from './my-orders.controller';

@Module({
  providers: [OrdersService],
  controllers: [MyOrdersController],
})
export class OrdersModule {}
