import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BaseEntity, ManyToOne } from 'typeorm';
import { ObjectType, Int, Field } from 'type-graphql'
import { Movie } from './Movie';

// @Entity()
// @ObjectType()
// export class Review extends BaseEntity {
//     @PrimaryGeneratedColumn()
//     @Field(() => Int)
//     id!: number;

//     @Column({ nullable: false })
//     @Field(() => Int)
//     movieId!: number;

    
//     @Column({ nullable: false })
//     @Field(() => Int)
//     userId!: number;

//     @ManyToOne(() => Movie, (movie) => movie)
//     movie: Movie;

// }