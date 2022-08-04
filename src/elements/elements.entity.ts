import { Entity, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, Tree } from 'typeorm';

@Entity()
@Tree("materialized-path")
export class Element {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    number: number;

    @TreeChildren()
    children: Element[]

    @TreeParent()
    parent: Element
}