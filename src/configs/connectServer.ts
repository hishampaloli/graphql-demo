import 'reflect-metadata'
import { ApolloServer, } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers/user';
import { MovieResolver } from '../resolvers/movie'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ReviewResolver } from '../resolvers/review';



export const connectApollo = async (app: any) => {
    try {
        const apolloServer = new ApolloServer({
            schema: await buildSchema({
                resolvers: [UserResolver, MovieResolver, ReviewResolver],
                validate: false
            }),
            context: ({ req, res }) => ({ req, res }),
            plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
        })
        await apolloServer.start()
        apolloServer.applyMiddleware({ app, cors: false })
    } catch (error) {
        console.log(error);
    }
}


