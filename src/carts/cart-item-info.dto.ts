import { CartItem, Prisma } from '@prisma/client';

export class CartItemInfoDto {
  cartItems: CartItem[];
  totalAmount: Prisma.Decimal;
}
