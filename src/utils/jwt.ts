import jwt from 'jsonwebtoken';

export const signJWT = (user: any) => {
    return jwt.sign({ user, }, process.env.JWT_SECRET! as string, { expiresIn: '30min' });
}

export const verifyJWT = (token: any) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
}