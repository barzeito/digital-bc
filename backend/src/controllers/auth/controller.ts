import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import createHttpError, { BadRequest, NotFound, Unauthorized } from "http-errors";
import getModel from "../../models/auth/factory";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingUser = await getModel().getByEmail(req.body.email)
        if (existingUser) {
            return next(createHttpError(BadRequest('User with this email is already exist')));
        }
        const user = await getModel().signUp(req.body);
        res.status(StatusCodes.CREATED).json(user)
    } catch (err) {
        return next(createHttpError(Unauthorized(ReasonPhrases.UNAUTHORIZED)));
    }
}

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getModel().signIn(req.body);
        if (!user) return next(createHttpError(Unauthorized(`Couldn't find username or password`)));
        res.json(user)
    } catch (err) {
        return next(createHttpError(Unauthorized(ReasonPhrases.UNAUTHORIZED)));
    }
}