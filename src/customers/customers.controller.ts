import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateCustomerDto } from './update-customer.dto';
import { CustomersService } from './customers.service';
import { Request } from 'express';
import { AddNewCustomerDto } from './add-customer-info.dto';
import { NewUserAuthGuard } from 'src/auth/new-user-auth.guard';
import { CustomerAuthGuard } from 'src/auth/customer-auth.guard';

@UseGuards(CustomerAuthGuard)
@Controller('profile')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @Render('profile')
  getProfileUpdatePage() {
    return { title: 'Thông tin của tôi' };
  }

  @UseGuards(NewUserAuthGuard)
  @Get('setup')
  @Render('profile-setup')
  getProfileSetupPage() {
    return { title: 'Thiết lập thêm thông tin' };
  }

  @UseGuards(NewUserAuthGuard)
  @Post('setup')
  @Redirect('/')
  async addNew(@Req() req: Request, @Body() customerDto: AddNewCustomerDto) {
    if (!req.firebaseUid) {
      throw new Error('No Firebase user UID is provided');
    }
    return this.customersService.addCustomerInfo(req.firebaseUid, customerDto);
  }

  @Post('edit')
  @Redirect('/profile')
  async update(@Req() req: Request, @Body() customerDto: UpdateCustomerDto) {
    const currentUser = req.user;
    if (!currentUser) {
      throw new Error('No current user is provided');
    }
    return this.customersService.updateCustomer(currentUser.id, customerDto);
  }
}
