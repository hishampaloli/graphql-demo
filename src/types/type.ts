import { Request } from 'express';
import { User } from '../entities/User';

export interface MyContext {
    req: Request & { session: any & { user?: object; token?: string } };
    res: Response
    user: any
}