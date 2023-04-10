import { Controller, Get, Render } from '@nestjs/common';
import { ProductsService } from './products/products.service';

@Controller()
export class AppController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Render('homepage')
  async getIndex() {
    const popularProducts = await this.productsService.getPopularProducts();
    const recentProducts = await this.productsService.getRecentProducts();
    return { title: 'ABC Food', popularProducts, recentProducts };
  }
}
