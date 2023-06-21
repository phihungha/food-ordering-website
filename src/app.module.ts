import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MyCartModule } from './carts/my-cart.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FormatterInterceptor } from './formatter.interceptor';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    UsersModule,
    CustomersModule,
    MyCartModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatterInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
