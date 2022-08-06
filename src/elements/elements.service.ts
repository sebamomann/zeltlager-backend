import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, TreeRepository } from 'typeorm';
import { Element } from './elements.entity';

@Injectable()
export class ElementsService {
    async findElementByNameMatch(name: string, includeChildren: boolean, includeAncestors: boolean, childrenDepth: number, parentDepth: number) {
        const elements = await this.elementsRepository.find({ where: { name: Like(`%${name}%`) } })
        for (let i = 0; i < elements.length; i++) {
            elements[i] = await this.handleAncestorsAndDescendents(elements[i], includeChildren, includeAncestors, childrenDepth, parentDepth);
        }

        return elements;

    }
    async getRoots(depth: number): Promise<Element[]> {
        return await this.elementsRepository.manager.getTreeRepository(Element).findTrees({ depth });
    }

    async create(element: Element) {
        return this.elementsRepository.save(element)
    }

    constructor(@InjectRepository(Element) private elementsRepository: TreeRepository<Element>) {

    }

    async update(elementId: string, element: Element) {
        if (element.parent) {
            if (element.parent.id == elementId) {
                throw new Error("Cant set self as parent");
            }

            const parent = await this.elementsRepository.findOne({ where: { id: element.parent.id } })
            element.parent = parent;
        }

        element.id = elementId;

        return await this.elementsRepository.save(
            element
        )
    }

    async findElement(id: any, includeChildren: boolean, includeAncestors: boolean, childrenDepth: number, parentDepth: number): Promise<Element | { element: Element, children: Element[] } | { element: Element, ancestors: Element[] } | { element: Element, ancestors: Element[], children: Element[] }> {
        const element = await this.elementsRepository.findOne({ where: { id } });

        await this.handleAncestorsAndDescendents(element, includeChildren, includeAncestors, childrenDepth, parentDepth);

        return element;
    }

    async handleAncestorsAndDescendents(element: Element, includeChildren: boolean, includeAncestors: boolean, childrenDepth: number, parentDepth: number) {
        if (!includeAncestors && !includeChildren)
            return element;

        if (includeChildren) {
            element = await this.elementsRepository.manager.getTreeRepository(Element)
                .findDescendantsTree(
                    element,
                    { depth: childrenDepth }
                )
        }

        if (includeAncestors) {
            element = await this.elementsRepository.manager.getTreeRepository(Element)
                .findAncestorsTree(
                    element,
                    { depth: parentDepth }
                )
        }

        return element;
    }
}
