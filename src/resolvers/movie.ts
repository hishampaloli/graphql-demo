import { Arg, Mutation, Resolver, Query, Int, UseMiddleware, } from 'type-graphql';
import { Like } from 'typeorm'
import { ApolloError } from 'apollo-server-express';
import { Movie } from '../entities/Movie';
import { isAuth } from '../middlewares/auth'



@Resolver()
export class MovieResolver {
    @Mutation(() => Movie)
    @UseMiddleware(isAuth)
    async createMovie(
        @Arg('movieName', () => String) movieName: string,
        @Arg('description', () => String) description: string,
        @Arg('directorName', () => String) directorName: string,
        @Arg('releaseDate', () => Date) releaseDate: Date,
    ): Promise<Movie> {
        try {
            return await Movie.create({ movieName, description, directorName, releaseDate }).save();
        } catch (error: any) {
            throw new ApolloError(error)
        }
    }

    @Query(() => [Movie])
    async allMovie(
        @Arg('pagenumber', () => Int) pagenumber: number,
        @Arg('searchQry', () => String) searchQry: string,
    ): Promise<Movie[]> {
        try { 
            return await Movie.find({
                where: { movieName: Like(`%${searchQry}%`) },
                order: { movieName: 'ASC' },
                skip: (pagenumber - 1) * 2,
                take: 2,
            });
        } catch (error: any) {
            throw new ApolloError(error)
        }
    }

    @Query(() => Movie, { nullable: true })
    async movie(
        @Arg("id", () => Int)
        id: number
    ): Promise<Movie | null> {
        try {
            return await Movie.findOne({ where: { id } ,relations: {reviews: true}})
        } catch (err: any) {
            throw new ApolloError(err)
        }
    }

    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async updateMovie(
        @Arg("id", () => Int) id: number,
        @Arg('movieName', () => String) movieName: string,
        @Arg('description', () => String) description: string,
        @Arg('directorName', () => String) directorName: string,
    ): Promise<string> {
        try {
            let movie = await Movie.findOne({ where: { id } });
            if (!movie) throw new ApolloError("No such movie found");
            await Movie.update({ id }, { movieName, description, directorName })
            return 'Movie Updated successfully'
        } catch (error: any) {
            throw new ApolloError(error)
        }
    }

    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async deleteMovie(
        @Arg("id", () => Int) id: number,
    ): Promise<string> {
        try {

            const movie = await Movie.findOne({ where: { id } });
            if (!movie) throw new ApolloError('No such movie found');
            await Movie.delete({ id })
            return 'Movie deleted'
        } catch (error: any) {
            throw new ApolloError(error)
        }
    }
}