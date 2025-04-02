import { NextFunction, Request, Response } from "express";
import createHttpError, { Forbidden, Unauthorized } from "http-errors";
import { ReasonPhrases } from "http-status-codes";
import userDTO, { Roles } from "../models/auth/user-dto";

declare global {
    namespace Express {
        export interface Request {
            user: userDTO
        }
    }
}

export default function enforceAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return next(createHttpError(Unauthorized(ReasonPhrases.UNAUTHORIZED)));
    if (req.user.roleId !== Roles.ADMIN) return next(createHttpError(Forbidden(ReasonPhrases.FORBIDDEN)));
    return next()
}