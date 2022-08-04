import { ElementsService } from './../elements.service';
import { Controller, Get, Query } from '@nestjs/common';
import { Element } from '../elements.entity';

@Controller('elements/roots')
export class RootsController {
    constructor(private elementsService: ElementsService) {
    }

    @Get()
    async getRoots(@Query("depth") depth: number): Promise<Element[]> {
        return await this.elementsService.getRoots(depth);
    }
}
