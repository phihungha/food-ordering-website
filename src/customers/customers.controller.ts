import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Render,
} from '@nestjs/common';
import { CustomerDto } from './customer.dto';
import { CustomersService } from './customers.service';

@Controller('profile')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @Render('profile')
  profileUpdatePage() {
    return { title: 'Thông tin của tôi' };
  }

  @Post()
  async signUp(@Body() customerDto: CustomerDto) {
    return this.customersService.createCustomer(customerDto);
  }

  @Patch(':id')
  async update(@Param('id') orderId: number, @Body() customerDto: CustomerDto) {
    return this.customersService.updateCustomer(orderId, customerDto);
  }
}
