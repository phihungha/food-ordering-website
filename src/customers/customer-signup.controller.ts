import { Body, Controller, Get, Post, Redirect, Render } from '@nestjs/common';
import { CreateCustomerDto } from './create-customer.dto';
import { CustomersService } from './customers.service';

@Controller('signup')
export class CustomerSignupController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @Render('signup')
  signUpPage() {
    return { title: 'Đăng ký tài khoản ABC' };
  }

  @Post()
  @Redirect('login?signupSucceed=true')
  async signUp(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.createCustomer(createCustomerDto);
  }
}
