import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsProvider: ProductsService) {}

  @Get()
  @Render('products')
  async getProducts() {
    const products = await this.productsProvider.getProducts();
    return { products, title: 'ABC Products' };
  }

  @Get(':id')
  @Render('product-details')
  async getProductDetails(@Param('id', ParseIntPipe) productId: number) {
    const product = await this.productsProvider.getProductById(productId);
    return { product, title: 'ABC Products' };
  }
}
