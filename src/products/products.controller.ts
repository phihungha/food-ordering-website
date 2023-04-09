import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { User } from '@prisma/client';
import { Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private productsProvider: ProductsService) {}

  @Get()
  @Render('products')
  async getProducts(@Query('search') searchTerm: string | undefined) {
    const products = await this.productsProvider.getProducts(searchTerm);
    return { products, title: 'ABC Products' };
  }

  @Get(':id')
  @Render('product-details')
  async getProductDetails(@Param('id') productId: number, @Req() req: Request) {
    const currentUser = req.user! as User;
    const result = await this.productsProvider.getProductById(
      productId,
      currentUser.id,
    );
    return {
      product: result.product,
      cartQuantity: result.cartQuantity,
      title: 'ABC Products',
    };
  }
}
