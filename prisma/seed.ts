import * as bcrypt from 'bcrypt';
import {
  EmployeeType,
  OrderStatus,
  PrismaClient,
  UserType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function seedDb() {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('12345678', salt);

  const customer1 = await prisma.customer.create({
    data: {
      user: {
        create: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@gmail.com',
          phoneNumber: '0123456780',
          type: UserType.Customer,
          hashedPassword: password,
        },
      },
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      user: {
        create: {
          name: 'Nguyễn Văn B',
          email: 'nguyenvanb@gmail.com',
          phoneNumber: '0123456781',
          type: UserType.Customer,
          hashedPassword: password,
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
          phoneNumber: '0123456782',
          type: UserType.Employee,
          hashedPassword: password,
        },
      },
      type: EmployeeType.OrderManager,
    },
  });

  await prisma.employee.create({
    data: {
      user: {
        create: {
          name: 'Nguyễn Hàng Hóa',
          email: 'nguyenhanghoa@gmail.com',
          phoneNumber: '0123456783',
          type: UserType.Employee,
          hashedPassword: password,
        },
      },
      type: EmployeeType.InventoryManager,
    },
  });

  await prisma.productCategory.createMany({
    data: [
      {
        name: 'Snack',
      },
      {
        name: 'Sữa',
      },
      {
        name: 'Rau củ',
      },
    ],
  });

  await prisma.product.create({
    data: {
      name: 'Lays Potato',
      category: {
        connect: { name: 'Snack' },
      },
      unit: 'cái',
      price: 10000,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Bánh Bắp Ngọt',
      category: {
        connect: { name: 'Snack' },
      },
      unit: 'cái',
      price: 5000,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Milo',
      category: {
        connect: { name: 'Sữa' },
      },
      unit: 'cái',
      price: 8000,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Rau muống',
      category: {
        connect: { name: 'Rau củ' },
      },
      unit: 'kg',
      price: 8000,
    },
  });

  await prisma.order.create({
    data: {
      customer: { connect: { id: customer1.id } },
      items: {
        create: [
          {
            product: { connect: { name: 'Lays Potato' } },
            quantity: 1,
            unitPrice: 10000,
            itemPrice: 10000,
          },
          {
            product: { connect: { name: 'Milo' } },
            quantity: 1,
            unitPrice: 8000,
            itemPrice: 8000,
          },
          {
            product: { connect: { name: 'Bánh Bắp Ngọt' } },
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
      customer: { connect: { id: customer1.id } },
      items: {
        create: [
          {
            product: { connect: { name: 'Milo' } },
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

  await prisma.order.create({
    data: {
      customer: { connect: { id: customer2.id } },
      items: {
        create: [
          {
            product: { connect: { name: 'Rau muống' } },
            quantity: 2,
            unitPrice: 8000,
            itemPrice: 16000,
          },
        ],
      },
      totalAmount: 16000,
      status: OrderStatus.Pending,
    },
  });

  await prisma.cartItem.create({
    data: {
      customer: { connect: { id: customer1.id } },
      product: { connect: { name: 'Lays Potato' } },
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      customer: { connect: { id: customer1.id } },
      product: { connect: { name: 'Rau muống' } },
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      customer: { connect: { id: customer2.id } },
      product: { connect: { name: 'Milo' } },
      quantity: 2,
    },
  });
}

seedDb()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
