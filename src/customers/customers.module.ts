import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UsersModule } from 'src/users/users.module';
import { SignupController } from './signup.controller';

@Module({
  imports: [UsersModule],
  providers: [CustomersService],
  controllers: [SignupController],
})
export class CustomersModule {}
