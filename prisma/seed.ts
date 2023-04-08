import {
  EmployeeType,
  OrderStatus,
  PrismaClient,
  UserType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.customer.create({
    data: {
      user: {
        create: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@gmail.com',
          phoneNumber: '0123456789',
          type: UserType.Customer,
          hashedPassword: '1234',
        },
      },
    },
  });

  await prisma.employee.create({
    data: {
      user: {
        create: {
          name: 'Nguyễn Đơn Hàng',
          email: 'nguyendonhang@gmail.com',
          phoneNumber: '012342322',
          type: UserType.Employee,
          hashedPassword: '1234',
        },
      },
      type: EmployeeType.OrderManager,
    },
  });

  await prisma.productCategory.createMany({
    data: [
      {
        name: 'Snack',
      },
      {
        name: 'Dairy',
      },
    ],
  });

  await prisma.product.create({
    data: {
      name: 'Lays Potato',
      category: {
        connect: { name: 'Snack' },
      },
      unit: 'item(s)',
      price: 10000,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Bánh bắp',
      category: {
        connect: { name: 'Snack' },
      },
      unit: 'item(s)',
      price: 5000,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Milo Small',
      category: {
        connect: { name: 'Dairy' },
      },
      unit: 'item(s)',
      price: 8000,
    },
  });

  await prisma.order.create({
    data: {
      customer: { connect: { id: customer.id } },
      items: {
        create: [
          {
            product: { connect: { name: 'Lays Potato' } },
            quantity: 1,
            unitPrice: 10000,
            itemPrice: 10000,
          },
          {
            product: { connect: { name: 'Milo Small' } },
            quantity: 1,
            unitPrice: 8000,
            itemPrice: 8000,
          },
          {
            product: { connect: { name: 'Bánh bắp' } },
            quantity: 2,
            unitPrice: 5000,
            itemPrice: 10000,
          },
        ],
      },
      status: OrderStatus.Pending,
      totalAmount: 28000,
    },
  });

  await prisma.order.create({
    data: {
      customer: { connect: { id: customer.id } },
      items: {
        create: [
          {
            product: { connect: { name: 'Milo Small' } },
            quantity: 2,
            unitPrice: 8000,
            itemPrice: 16000,
          },
        ],
      },
      totalAmount: 16000,
      finishedTime: new Date(),
      status: OrderStatus.Completed,
    },
  });

  await prisma.cartItem.create({
    data: {
      customer: { connect: { id: customer.id } },
      product: { connect: { name: 'Lays Potato' } },
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      customer: { connect: { id: customer.id } },
      product: { connect: { name: 'Milo Small' } },
      quantity: 2,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
