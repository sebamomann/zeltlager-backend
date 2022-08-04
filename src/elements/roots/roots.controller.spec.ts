import { Test, TestingModule } from '@nestjs/testing';
import { RootsController } from './roots.controller';

describe('RootsController', () => {
  let controller: RootsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RootsController],
    }).compile();

    controller = module.get<RootsController>(RootsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
