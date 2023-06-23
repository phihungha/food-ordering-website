import { IsPhoneNumber } from 'class-validator';

export class AddNewCustomerDto {
  @IsPhoneNumber('VN')
  phoneNumber: string;
}
