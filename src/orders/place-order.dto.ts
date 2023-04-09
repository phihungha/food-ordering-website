import { IsNotEmpty } from 'class-validator';

export class PlaceOrderDto {
  @IsNotEmpty()
  deliveryAddress: string;
}
