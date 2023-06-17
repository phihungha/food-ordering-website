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
      name: 'Khoai tây Lays',
      description: `Lay's Snack Khoai Tây số 1* Thế Giới nay đã chính thức có mặt tại Việt Nam
      Trực thuộc tập đoàn danh tiếng PepsiCo, trong suốt hơn 86 tuổi đời,
      Lay's đã không ngừng tiếp thu và phát triển để tối ưu hoá trải nghiệm vị giác
      cho người dùng. Việc lắng nghe, tiếp thu ý kiến từ chính những khách hàng
      thân yêu để không ngừng sáng tạo ra những hương vị thơm ngon độc đáo,
      Lay's ngày nay đã thành công chinh phục khẩu vị của hàng triệu “tín đồ”
      snack tại hơn 100 quốc gia với loạt hương vị nổi bật như Barbecue, Naturel,
      Bicky Crisp, Barbecue Ham, Sour Cream and Onion, Alligator, Mountain Dew,
      the 90's, Crispy Taco ...`,
      imageUrl:
        'https://abc-food-ordering.s3.ap-southeast-1.amazonaws.com/public/productImages/khoai-tay-lays.webp',
      category: {
        connect: { name: 'Snack' },
      },
      unit: 'cái',
      price: 10000,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Snack Bắp Ngọt',
      description: `Với các công đoạn thu hoạch bắp, xay bắp, nướng bắp được
      thực hiện một cách tỉ mỉ sẽ đảm bảo được độ giòn vừa ý, vị ngon đặc trưng của
      Oishi Snack Bắp Ngọt. Hãy để Snack bắp đưa bạn vào xứ sở vui tươi và tự do.`,
      imageUrl:
        'https://abc-food-ordering.s3.ap-southeast-1.amazonaws.com/public/productImages/snack-bap-ngot.webp',
      category: {
        connect: { name: 'Snack' },
      },
      unit: 'cái',
      price: 5000,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Sữa Hộp Milo',
      description: `Sữa lúa mạch Nestlé® MILO® tiếp sức nhà vô địch nhí
      của mẹ với nguồn dinh dưỡng từ sữa, tăng cường nhờ công thức ACTIV-GO
       từ Thụy Sĩ - là sự kết hợp độc đáo của PROTOMALT® chiết xuất từ
       mầm lúa mạch cùng tổ hợp các vitamin và khoáng chất thiết yếu.`,
      imageUrl:
        'https://abc-food-ordering.s3.ap-southeast-1.amazonaws.com/public/productImages/sua-hop-milo.webp',
      category: {
        connect: { name: 'Sữa' },
      },
      unit: 'cái',
      price: 8000,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Rau muống tươi',
      description: 'Rau muống tươi organic từ nông trại Đà Lạt',
      imageUrl:
        'https://abc-food-ordering.s3.ap-southeast-1.amazonaws.com/public/productImages/rau-muong.webp',
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
      deliveryAddress: '178 Võ Nguyên Giáp',
      items: {
        create: [
          {
            product: { connect: { name: 'Khoai tây Lays' } },
            quantity: 1,
            unitPrice: 10000,
            itemPrice: 10000,
          },
          {
            product: { connect: { name: 'Sữa Hộp Milo' } },
            quantity: 1,
            unitPrice: 8000,
            itemPrice: 8000,
          },
          {
            product: { connect: { name: 'Snack Bắp Ngọt' } },
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
      deliveryAddress: '178 Võ Văn Cừ',
      items: {
        create: [
          {
            product: { connect: { name: 'Sữa Hộp Milo' } },
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
      deliveryAddress: '178 Võ Văn Cừ',
      items: {
        create: [
          {
            product: { connect: { name: 'Rau muống tươi' } },
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
      product: { connect: { name: 'Khoai tây Lays' } },
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      customer: { connect: { id: customer1.id } },
      product: { connect: { name: 'Rau muống tươi' } },
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      customer: { connect: { id: customer2.id } },
      product: { connect: { name: 'Sữa Hộp Milo' } },
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
