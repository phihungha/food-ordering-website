import { Test, TestingModule } from '@nestjs/testing';
import { MyCartService } from './my-cart.service';

describe('MyCartService', () => {
  let service: MyCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyCartService],
    }).compile();

    service = module.get<MyCartService>(MyCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
