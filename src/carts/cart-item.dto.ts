import { CartItem, Product } from '@prisma/client';

export type CartItemDto = CartItem & { product: Product };
