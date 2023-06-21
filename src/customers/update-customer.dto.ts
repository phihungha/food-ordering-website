import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UpdateCustomerDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}
