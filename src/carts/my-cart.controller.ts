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
import { SessionGuard } from 'src/auth/session.guard';
import { AddToCartDto } from './add-to-cart.dto';
import { User } from '@prisma/client';

@Controller('my-cart')
@UseGuards(SessionGuard)
export class MyCartController {
  constructor(private myCartService: MyCartService) {}

  @Get()
  @Render('my-cart')
  async getCart(@Req() req: Request) {
    const currentUser = req.user as User;
    const cart = await this.myCartService.getCart(currentUser.id);
    return { title: 'My cart', cart };
  }

  @Post()
  @Redirect('my-cart')
  async addToCart(@Req() req: Request, @Body() body: AddToCartDto) {
    const currentUser = req.user as User;
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
    const currentUser = req.user as User;
    return await this.myCartService.removeFromCart(currentUser.id, itemId);
  }

  @Delete()
  async clearCart(@Req() req: Request) {
    const currentUser = req.user as User;
    return await this.myCartService.clearCart(currentUser.id);
  }
}
