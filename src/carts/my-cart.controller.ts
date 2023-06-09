import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Redirect,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MyCartService } from './my-cart.service';
import { Request } from 'express';
import { AddToCartDto } from './add-to-cart.dto';
import { CustomerAuthGuard } from 'src/auth/customer-auth.guard';

@Controller('my-cart')
@UseGuards(CustomerAuthGuard)
export class MyCartController {
  constructor(private myCartService: MyCartService) {}

  @Get()
  @Render('my-cart')
  async getCart(@Req() req: Request) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new Error('No current user is provided');
    }
    const cart = await this.myCartService.getCart(currentUser.id);
    return { title: 'My cart', cart };
  }

  @Post()
  @Redirect('my-cart')
  async addToCart(@Req() req: Request, @Body() body: AddToCartDto) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new Error('No current user is provided');
    }
    return await this.myCartService.addToCart(
      body.productId,
      currentUser.id,
      body.quantity,
    );
  }

  @Delete(':id')
  async removeFromCart(
    @Req() req: Request,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new Error('No current user is provided');
    }
    return await this.myCartService.removeFromCart(currentUser.id, itemId);
  }

  @Delete()
  async clearCart(@Req() req: Request) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new Error('No current user is provided');
    }
    return await this.myCartService.clearCart(currentUser.id);
  }
}
