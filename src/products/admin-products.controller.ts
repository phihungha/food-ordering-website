import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './product.dto';
import { EmployeeRoles } from 'src/auth/employee-roles.decorator';

@Controller('admin/products')
@EmployeeRoles('manageInventory')
export class AdminProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Render('admin/products')
  async getProducts(@Query('search') searchTerm: string | undefined) {
    const products = await this.productsService.getProducts(searchTerm);
    return { products, title: 'ABC Products', searchTerm };
  }

  @Get(':id')
  @Render('admin/product-details')
  async getProductDetails(@Param('id') productId: number) {
    const result = await this.productsService.getProductById(productId);
    const popularProducts = await this.productsService.getPopularProducts();
    return {
      product: result.product,
      popularProducts,
      title: `${result.product.name}`,
    };
  }

  @Post()
  async addProduct(@Body() body: ProductDto) {
    return await this.productsService.addProduct(body);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') productId: number,
    @Body() body: ProductDto,
  ) {
    return await this.productsService.updateProduct(productId, body);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') productId: number) {
    return await this.productsService.deleteProduct(productId);
  }
}
