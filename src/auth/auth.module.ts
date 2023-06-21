import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CustomerAuthController } from './customer-auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AdminAuthController } from './admin-auth.controller';
import { SessionGuard } from './session.guard';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
  ],
  controllers: [CustomerAuthController, AdminAuthController],
})
export class AuthModule {}
