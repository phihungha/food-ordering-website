import { Prisma } from '@prisma/client';
import { CartItemDto } from './cart-item.dto';

export class CartItemInfoDto {
  cartItems: CartItemDto[];
  totalAmount: Prisma.Decimal;
}
