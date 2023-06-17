import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MyCartModule } from 'src/carts/my-cart.module';
import { AdminProductsController } from './admin-products.controller';

@Module({
  imports: [MyCartModule],
  providers: [ProductsService],
  controllers: [ProductsController, AdminProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
