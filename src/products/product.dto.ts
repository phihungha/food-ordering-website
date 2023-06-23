import { IsInt, IsNotEmpty, IsNumber, IsUrl, Min } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  name: string;

  @IsUrl()
  imageUrl: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  categoryId: number;

  @IsInt()
  @Min(1)
  price: number;

  @IsNotEmpty()
  unit: string;
}
