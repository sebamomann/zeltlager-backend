import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Element } from './elements.entity';
import { ElementsService } from './elements.service';

@Controller('elements')
export class ElementsController {
    constructor(private elementsService: ElementsService) {

    }

    @Get('')
    async findByNameMatch(@Query("name") name: string,
        @Query("children") includeChildren: boolean,
        @Query("parents") includeAncestors: boolean,
        @Query("childrenDepth") childrenDepth: number,
        @Query("parentDepth") parentDepth: number) {
        const elements = await this.elementsService.findElementByNameMatch(name, includeChildren, includeAncestors, childrenDepth, parentDepth)

        return elements;
    }

    @Get(':id')
    async findOne(@Param("id") id,
        @Query("children") includeChildren: boolean,
        @Query("parents") includeAncestors: boolean,
        @Query("childrenDepth") childrenDepth: number,
        @Query("parentDepth") parentDepth: number) {
        const element = await this.elementsService.findElement(id, includeChildren, includeAncestors, childrenDepth, parentDepth)

        return element;
    }

    @Post()
    async createElement(@Body() element: Element): Promise<Element> {
        return await this.elementsService.create(element);
    }

    @Put(':id')
    async updateElement(@Body() element: Element, @Param("id") id: string) {
        this.elementsService.update(id, element);
    }
}
