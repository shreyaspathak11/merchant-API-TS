import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/User';
import jwt from 'jsonwebtoken';

declare module 'express' {
    interface Request {
        user?: any; // Replace 'any' with the actual user type if available
    }
}
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.cookies;

        if (token === 'none') {
            return next();
        }

        if (!token) {
            res.status(401).json({
                message: 'You need to login first',
            });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');   //verify token

        req.user = await UserModel.findById(decoded._id);   //find user by id

        next();
    } catch (error : any) {
        res.status(500).json({
            message: error.message,
        });
        return;
    }
};
