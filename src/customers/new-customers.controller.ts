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
import { CustomersService } from './customers.service';
import { Request } from 'express';
import { AddNewCustomerDto } from './add-customer-info.dto';
import { NewUserAuthGuard } from 'src/auth/new-user-auth.guard';

@UseGuards(NewUserAuthGuard)
@Controller('profile')
export class NewCustomersController {
  constructor(private customersService: CustomersService) {}

  @Get('setup')
  @Render('profile-setup')
  getProfileSetupPage() {
    return { title: 'Thiết lập thêm thông tin' };
  }

  @Post('setup')
  @Redirect('/')
  async addNew(@Req() req: Request, @Body() customerDto: AddNewCustomerDto) {
    if (!req.firebaseUid) {
      throw new Error('No Firebase user UID is provided');
    }
    return this.customersService.addCustomerInfo(req.firebaseUid, customerDto);
  }
}
