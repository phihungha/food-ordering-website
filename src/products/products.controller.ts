import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { User } from '@prisma/client';
import { Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Render('products')
  async getProducts(@Query('search') searchTerm: string | undefined) {
    const products = await this.productsService.getProducts(searchTerm);
    return { products, title: 'ABC Products', searchTerm };
  }

  @Get(':id')
  @Render('product-details')
  async getProductDetails(@Param('id') productId: number, @Req() req: Request) {
    const currentUser = req.user as User | undefined;
    const result = await this.productsService.getProductById(
      productId,
      currentUser?.id,
    );
    const popularProducts = await this.productsService.getPopularProducts();
    return {
      product: result.product,
      cartQuantity: result.cartQuantity,
      popularProducts,
      title: `${result.product.name} | ABC Food`,
    };
  }
}
