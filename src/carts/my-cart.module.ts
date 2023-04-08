import { Module } from '@nestjs/common';
import { MyCartService } from './my-cart.service';
import { MyCartController } from './my-cart.controller';

@Module({
  providers: [MyCartService],
  controllers: [MyCartController],
})
export class MyCartModule {}
