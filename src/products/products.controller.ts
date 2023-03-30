import { Controller, Get } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsProvider: ProductsService) {}

  @Get()
  async getProducts(): Promise<Product[]> {
    return await this.productsProvider.getProducts();
  }
}
