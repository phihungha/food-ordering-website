import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UsersModule } from 'src/users/users.module';
import { CustomerSignupController } from './customer-signup.controller';

@Module({
  imports: [UsersModule],
  providers: [CustomersService],
  controllers: [CustomerSignupController],
})
export class CustomersModule {}
