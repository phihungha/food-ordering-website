import { IsNotEmpty, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  productId: number;

  @Min(0)
  quantity: number;
}
