import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BaseEntity } from 'typeorm';
import { ObjectType, Int, Field } from 'type-graphql'


@Entity()
@ObjectType()
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id!: number;

    @Column({ nullable: false })
    @Field(() => String)
    movieName: string;

    @Column({ nullable: false })
    @Field(() => String)
    description: string;

    @Column({ nullable: false })
    @Field(() => String)
    directorName: string;

    @Column({ nullable: false })
    @Field(() => Date)
    releaseDate: Date;

}