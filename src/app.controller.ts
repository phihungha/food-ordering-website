import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('homepage')
  getIndex() {
    return { title: 'ABC Food' };
  }
}
