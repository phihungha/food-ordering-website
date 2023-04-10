import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MyOrdersController } from './my-orders.controller';
import { MyCartModule } from 'src/carts/my-cart.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [MyCartModule, ProductsModule],
  providers: [OrdersService],
  controllers: [MyOrdersController],
})
export class OrdersModule {}
