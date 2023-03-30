import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Int, Field } from 'type-graphql'
import { Movie } from './Movie';
import { User } from './User';

@Entity()
@ObjectType()
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id!: number;


    @ManyToOne(() => Movie, movie => movie.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
    @Field(() => Movie)
    movie: Movie;

    @ManyToOne(() => User, user => user.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    @Field(() => User)
    user: User;

    @Column()
    @Field(() => String)
    comment: string

    @Column()
    @Field(() => Int)
    rating: number
}