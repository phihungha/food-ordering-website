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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddToCartDto } from './add-to-cart.dto';
import { User } from '@prisma/client';

@Controller('my-cart')
@UseGuards(JwtAuthGuard)
export class MyCartController {
  constructor(private myCartService: MyCartService) {}

  @Get()
  @Render('my-cart')
  async getCart(@Req() req: Request) {
    const currentUser = req.user! as User;
    const cart = await this.myCartService.getCart(currentUser.id);
    return { title: 'My cart', cart };
  }

  @Post()
  @Redirect('my-cart')
  async addToCart(@Req() req: Request, @Body() body: AddToCartDto) {
    const currentUser = req.user! as User;
    await this.myCartService.addToCart(
      body.productId,
      currentUser.id,
      body.quantity,
    );
  }

  @Delete(':id')
  @Redirect('my-cart')
  async removeFromCart(
    @Req() req: Request,
    @Param('id', ParseIntPipe) itemId: number,
  ) {
    const currentUser = req.user! as User;
    await this.myCartService.removeFromCart(currentUser.id, itemId);
  }

  @Delete()
  @Redirect('my-cart')
  async clearCart(@Req() req: Request) {
    const currentUser = req.user! as User;
    await this.myCartService.clearCart(currentUser.id);
  }
}
