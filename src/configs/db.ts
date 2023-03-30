import { createConnection } from 'typeorm'
import { User } from '../entities/User';
import { Movie } from '../entities/Movie';
import { Review } from '../entities/Review';


export const connectDB = async () => {

    const conn = await createConnection({
        type: 'postgres',
        database: process.env.POSTGRES_TABLE,
        entities: [User, Movie, Review],
        logging: true,
        synchronize: true,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432
    });

}
