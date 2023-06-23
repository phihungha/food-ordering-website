import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CustomerAuthController } from './customer-auth.controller';
import { AdminAuthController } from './admin-auth.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoginStatusInterceptor } from './login-status.interceptor';
import { AuthMiddleware } from './auth.middleware';

@Global()
@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoginStatusInterceptor,
    },
  ],
  controllers: [CustomerAuthController, AdminAuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
