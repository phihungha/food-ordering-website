import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('VN')
  phoneNumber: string;

  password: string;
}
