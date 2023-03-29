import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { EmployeesModule } from './employees/employees.module';
import { CartsController } from './customers/carts.controller';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    UsersModule,
    CustomersModule,
    EmployeesModule,
    CartsModule,
  ],
  controllers: [AppController, CartsController],
  providers: [AppService],
})
export class AppModule {}
