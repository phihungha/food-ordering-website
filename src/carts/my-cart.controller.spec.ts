import { Test, TestingModule } from '@nestjs/testing';
import { MyCartController } from './my-cart.controller';

describe('MyCartController', () => {
  let controller: MyCartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyCartController],
    }).compile();

    controller = module.get<MyCartController>(MyCartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
