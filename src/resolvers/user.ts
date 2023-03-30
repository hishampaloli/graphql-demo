import { Arg, Mutation, Resolver, Ctx, Query, Int, ObjectType, Field, UseMiddleware } from 'type-graphql';
import { User } from '../entities/User';

import { signJWT } from '../utils/jwt'
import { ApolloError } from 'apollo-server-express';
import { MyContext } from '../types/type'

import { isAuth } from '../middlewares/auth'
import bcrypt from 'bcrypt';


@ObjectType()
class LoginOutput {
    @Field(() => User)
    user: User;
    @Field(() => String)
    token: string;
}



@Resolver()
export class UserResolver {
    @Mutation(() => LoginOutput)
    async signup(
        @Arg('emailId') emailId: string,
        @Arg('userName') userName: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
    ): Promise<LoginOutput> {

        try {
            const user = await User.create({ emailId, password, userName }).save();
            const token = signJWT(user);
            return { user, token }

        } catch (error) {
            throw new Error('Email already exists')
        }

    }

    @Mutation(() => LoginOutput)
    async login(
        @Arg('emailId') emailId: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
    ): Promise<LoginOutput> {
        const user = await User.findOne({ where: { emailId } });
        if (!user) throw new ApolloError('User not found');

        const valid = await user.CompareUserPassword(password);
        if (!valid) throw new ApolloError('Invalid password');

        const token = signJWT(user);

        return { user, token }
    }

    @Query(() => User)
    @UseMiddleware(isAuth)
    async me(@Ctx() { user }: MyContext): Promise<User> {
        console.log(user
        );

        let userDetails = await User.findOne({ where: { emailId: user.user.emailId } })
        if (!userDetails) throw new Error('no user found');
        return userDetails;
    }

    @Query(() => [User])
    async allUsers(): Promise<User[]> {
        return await User.find({})
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async changePassword(
        @Arg('oldPass', () => String) oldPass: string,
        @Arg('newPass', () => String) newPass: string,
        @Ctx() { user }: MyContext
    ): Promise<boolean> {
        try {
            const userDetails = await User.findOne({ where: { emailId: user.user.emailId } });
            if (!userDetails) throw new ApolloError('User not found');

            const valid = await userDetails.CompareUserPassword(oldPass);
            if (!valid) throw new ApolloError('Invalid old password password');

            await User.update({ emailId: userDetails.emailId }, { password: await bcrypt.hash(newPass, 10) });
            return true
        } catch (error: any) {
            throw new ApolloError(error)
        }
    }

    @Mutation(() => Boolean)
    async deleteAll(): Promise<any> {
        await User.delete({})
        return true
    }
}