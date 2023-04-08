import { Test, TestingModule } from '@nestjs/testing';
import { MyOrdersController } from './my-orders.controller';

describe('MyOrdersController', () => {
  let controller: MyOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyOrdersController],
    }).compile();

    controller = module.get<MyOrdersController>(MyOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
