import { IsIn } from 'class-validator';

export class OrderUpdateDto {
  @IsIn(['canceled, completed'])
  status: string;
}
