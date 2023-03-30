import { Arg, Mutation, Resolver, Ctx, Query, Int, ObjectType, Field } from 'type-graphql';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server-express';
import { MyContext } from '../types/type'
import { AuthenticationError } from 'apollo-server-express'
import { isAuth } from '../middlewares/auth'


@ObjectType()
class LoginOutput {
    @Field(() => User)
    user: User;
    @Field(() => String)
    token: string;
}

// @ObjectType()
// class MeResponse {
//   @Field(() => {name: 's'}, { nullable: true })
//   user?: FieldError[];

//   @Field(() => User, { nullable: true })
//   user?: User;
// }

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
            const token = jwt.sign({ user }, 'process.env.JWT_SECRET' as string);
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

        const token = jwt.sign({ user, }, 'process.env.JWT_SECRET' as string, {expiresIn: '10min'});

        return { user, token }
    }

    @Query(() => User)
    async me(@Ctx() { req }: MyContext): Promise<User> {
        // let userDet = isAuth()
        let user = await User.findOne({ where: { emailId: 'userDet.emailId' } })
        if (!user) throw new Error('no user found');
        return user;
    }

    @Query(() => [User])
    async allUsers(): Promise<User[]> {
        return await User.find({})
    }
}