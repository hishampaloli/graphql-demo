import { AuthenticationError } from 'apollo-server-express'
import {verifyJWT} from '../utils/jwt'
import { MiddlewareFn } from "type-graphql";
import { MyContext } from '../types/type'


export const isAuth: MiddlewareFn<MyContext> = ({ context }, next): any => {

    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = verifyJWT(token);
                context.user = user
                return next();
            } catch (err) {
                throw new AuthenticationError('Invalid or Expired token. Please login !');
            }
        }
        throw new Error("Authentication token must be Bearer token");
    } else {
        throw new Error('Authorization header must be provided');
    }



};
