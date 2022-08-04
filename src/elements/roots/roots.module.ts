import { Module } from '@nestjs/common';
import { ElementsModule } from '../elements.module';
import { RootsController } from './roots.controller';

@Module({
  imports: [ElementsModule],
  controllers: [RootsController]
})
export class RootsModule { }
