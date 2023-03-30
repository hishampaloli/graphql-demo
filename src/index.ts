import 'reflect-metadata'
import express, { Express } from 'express'
import { ApolloServer, } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { TaskResolver } from './resolvers/task';
import { UserResolver } from './resolvers/user';
import { MovieResolver } from './resolvers/movie'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { createConnection } from 'typeorm'
import { Task } from './entities/Task';
import { User } from './entities/User';
import session from 'express-session';
import cookieSession from 'cookie-session'
import { ErrorHandler, errorHandlerMiddleware } from './middlewares/errorHandler'
import { Movie } from './entities/Movie';

const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        database: 'todolist-graphql-db',
        entities: [Task, User, Movie],
        logging: true,
        synchronize: true,
        username: 'postgres',
        password: 'paloli-postgresql-786',
        port: 5432
    });


    const app: Express = express();
    app.set("trust proxy", 1);

    app.use(
        cookieSession({
            signed: false,
            secure: false,
        })
    );


    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [TaskResolver, UserResolver, MovieResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
    })
    await apolloServer.start()

    apolloServer.applyMiddleware({ app, cors: false })

    app.use(errorHandlerMiddleware());

    app.get('/', (req, res) => res.json('786'));

    const port = 3001;

    app.listen(port, () => console.log('Server started 786'))

}

main().catch((err) => console.log(err));
