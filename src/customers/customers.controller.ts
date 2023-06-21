import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateCustomerDto } from './update-customer.dto';
import { CustomersService } from './customers.service';
import { Request } from 'express';
import { AddNewCustomerDto } from './add-customer-info.dto';
import { SessionGuard } from 'src/auth/session.guard';

@UseGuards(SessionGuard)
@Controller('profile')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @Render('profile')
  profileUpdatePage() {
    return { title: 'Thông tin của tôi' };
  }

  @Post()
  async addNew(@Req() req: Request, @Body() customerDto: AddNewCustomerDto) {
    if (!req.firebaseUid) {
      throw new Error('No Firebase user UID is provided');
    }
    return this.customersService.addCustomerInfo(req.firebaseUid, customerDto);
  }

  @Patch()
  async update(@Req() req: Request, @Body() customerDto: UpdateCustomerDto) {
    if (!req.user) {
      throw new Error('No current user is provided');
    }
    return this.customersService.updateCustomer(req.user.id, customerDto);
  }
}
