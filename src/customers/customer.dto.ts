import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CustomerDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}
