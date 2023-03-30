import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Like, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Int, Field } from 'type-graphql'
import { Review } from './Review';


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

    @OneToMany(() => Review, (review) => review.movie)
    @Field(() => [Review])
    reviews: Review[];

    @CreateDateColumn()
    @Field(() => Date)
    created: Date

    @UpdateDateColumn()
    @Field(() => Date)
    updated: Date
}