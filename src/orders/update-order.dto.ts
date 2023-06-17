import { IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsIn(['canceled, completed'])
  status: string;
}
