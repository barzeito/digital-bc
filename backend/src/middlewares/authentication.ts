import { NextFunction, Request, Response } from "express";
import config from 'config';
import { JwtPayload, verify } from "jsonwebtoken";
import getModel from "../models/auth/factory";
import createHttpError, { Unauthorized } from "http-errors";
import userDTO from "../models/auth/user-dto";

declare global {
    namespace Express {
        export interface Request {
            user: userDTO
        }
    }
}

export default async function authentication(req: Request, res: Response, next: NextFunction) {
    const header = req.header('authorization');
    if (!header) return next();
    const token = header.split(' ')[1];
    try {
        const { user } = verify(token, config.get<string>('app.jwt.secret')) as JwtPayload;
        req.user = await getModel().getOne(user.userId);
        return next();
    } catch (error) {
        return next(createHttpError(Unauthorized(error.message || error)));
    }
}