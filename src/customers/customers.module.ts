import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { NewCustomersController } from './new-customers.controller';

@Module({
  providers: [CustomersService],
  controllers: [CustomersController, NewCustomersController],
})
export class CustomersModule {}
