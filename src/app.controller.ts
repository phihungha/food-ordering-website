import { Controller, Get, Render, Req } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('homepage')
  getIndex() {
    return { title: 'ABC Food' };
  }
}
