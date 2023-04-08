import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EmployeesModule } from './employees/employees.module';
import { MyCartModule } from './carts/my-cart.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

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
    EmployeesModule,
    MyCartModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
