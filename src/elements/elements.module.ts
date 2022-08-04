import { Module } from '@nestjs/common';
import { ElementsService } from './elements.service';
import { ElementsController } from './elements.controller';
import { Element } from './elements.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Element])],
  providers: [ElementsService],
  controllers: [ElementsController],
  exports: [ElementsService]
})
export class ElementsModule { }
