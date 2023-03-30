import 'reflect-metadata'
import { connectDB } from './configs/db'
import { connectApollo } from './configs/connectServer'
import express, { Express } from 'express'
import dotenv from 'dotenv'


(async () => {
    try {
        const app: Express = express();
        dotenv.config();
        await connectDB();
        await connectApollo(app);
        app.listen(process.env.PORT, () => console.log('Server started 786 ' + process.env.PORT))
    } catch (error) {
        console.log(error);
    }
})()