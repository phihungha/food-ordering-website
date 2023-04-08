import { Controller, Get, Render } from '@nestjs/common';

@Controller('my-cart')
export class MyCartController {
  @Get()
  @Render('my-cart')
  getCart() {
    return { title: 'My cart' };
  }
}
