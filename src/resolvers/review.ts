import { Arg, Mutation, Resolver, Ctx, Query, Int, UseMiddleware, } from 'type-graphql';
import { MoreThanOrEqual, } from 'typeorm'
import { ApolloError } from 'apollo-server-express';
import { MyContext } from '../types/type'
import { Movie } from '../entities/Movie';
import { Review } from '../entities/Review';
import { isAuth } from '../middlewares/auth'
import { User } from '../entities/User';


@Resolver()
export class ReviewResolver {

    @Mutation(() => Review)
    @UseMiddleware(isAuth)
    async createReview(
        @Arg('movieId', () => Int) movieId: number,
        @Arg('rating', () => Int) rating: number,
        @Arg('comment') comment: string,
        @Ctx() { user }: MyContext,
    ): Promise<Review> {
        try {
            let movie = await Movie.findOne({ where: { id: movieId } })
            let userfound = await User.findOne({ where: { id: user.user.id } })

            if (!movie) throw new ApolloError('no such movie found')
            if (!userfound) throw new ApolloError('please login with proper credentials')

            return await Review.create({ comment, rating, movie, user: userfound }).save();
        } catch (error: any) {
            throw new ApolloError(error)
        }

    }

    @Query(() => [Review])
    @UseMiddleware(isAuth)
    async allReviews(
        @Ctx() { user }: MyContext
    ): Promise<Review[]> {
        let userId = user.user.id;
        return await Review.find({ order: { user: { id: userId ? "DESC" : "ASC" } }, relations: { movie: true, user: true } });
    }

    @Query(() => [Review])
    async movieReviews(
        @Arg('movieId', () => Int) movieId: number,
        @Arg('minRating', () => Int) minRating: number,
    ): Promise<Review[]> {
        return await Review.find({ where: { movie: { id: movieId }, rating: MoreThanOrEqual(minRating) }, relations: { movie: true, user: true } })
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async updateReview(
        @Arg('reviewId', () => Int) reviewId: number,
        @Arg('rating', () => Int) rating: number,
        @Arg('comment', () => String) comment: string,
        @Ctx() { user }: MyContext,
    ): Promise<boolean> {
        try {
            let review = await Review.findOne({ where: { id: reviewId, user: { id: user.user.id } } });

            if (!review) throw new ApolloError("No such review found");
            await Review.update({ id: reviewId, user: { id: user.user.id } }, { comment, rating })
            return true
        } catch (error: any) {
            throw new ApolloError(error)
        }
    }


    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteReview(
        @Arg('reviewId', () => Int) reviewId: number,
        @Ctx() { user }: MyContext,
    ): Promise<boolean> {
        try {
            let review = await Review.findOne({ where: { id: reviewId, user: { id: user.user.id } } });
            console.log(review);
            if (!review) throw new ApolloError("No such review found");

            await Review.delete({ id: reviewId })
            return true
        } catch (error: any) {
            throw new ApolloError(error)
        }
    }
}