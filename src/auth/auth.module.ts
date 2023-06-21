import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CustomerAuthController } from './customer-auth.controller';
import { AdminAuthController } from './admin-auth.controller';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [CustomerAuthController, AdminAuthController],
  exports: [AuthService],
})
export class AuthModule {}
