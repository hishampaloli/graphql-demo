import { Request } from 'express';

export interface MyContext {
    req: Request & { session: any & { user?: object; token?: string } };
    res: Response
    user: & { user: { emailId: string, userName: string, id: string } }
}