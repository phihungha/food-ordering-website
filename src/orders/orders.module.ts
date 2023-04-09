import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MyOrdersController } from './my-orders.controller';
import { MyCartModule } from 'src/carts/my-cart.module';

@Module({
  imports: [MyCartModule],
  providers: [OrdersService],
  controllers: [MyOrdersController],
})
export class OrdersModule {}
