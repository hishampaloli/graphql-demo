import { Arg, Mutation, Resolver, Ctx, Query, Int, ObjectType, Field, UseMiddleware, } from 'type-graphql';
import { ApolloError } from 'apollo-server-express';
import { MyContext } from '../types/type'
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
            throw new Error(error)
        }
    }

    @Query(() => [Movie])
    @UseMiddleware(isAuth)
    async allMovie(): Promise<Movie[]> {
        try {
            return await Movie.find({});
        } catch (error: any) {
            throw new Error(error)
        }
    }

    @Query(() => Movie, { nullable: true })
    @UseMiddleware(isAuth)
    async movie(
        @Arg("id", () => Int)
        id: number
    ): Promise<Movie | null> {
        try {
            return await Movie.findOne({ where: { id } })
        } catch (err: any) {
            throw new Error(err)
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
            if (!movie) throw new Error("No such movie found");
            await Movie.update({ id }, { movieName, description, directorName })
            return 'Movie Updated successfully'
        } catch (error: any) {
            throw new Error(error)
        }
    }

    @Mutation(() => String)
    @UseMiddleware(isAuth)
    async deleteMovie(
        @Arg("id", () => Int) id: number,
    ): Promise<string> {
        try {

            const movie = await Movie.findOne({ where: { id } });
            if (!movie) throw new Error('No such movie found');
            await Movie.delete({ id })
            return 'Movie deleted'
        } catch (error: any) {
            throw new Error(error)
        }
    }
}