import { BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm'
import { ObjectType, Int, Field } from 'type-graphql';

@Entity()
@ObjectType()
export class Task extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number

    @CreateDateColumn()
    @Field(() => Date)
    created: Date

    @UpdateDateColumn()
    @Field(() => Date)
    updated: Date

    @Column()
    @Field(() => String)
    title: string

    @Column()
    @Field(() => Boolean)
    isCompleted: boolean
}