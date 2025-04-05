import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases, OK } from "http-status-codes";
import createHttpError, { BadRequest, NotFound, Unauthorized } from "http-errors";
import getModel from "../../models/auth/factory";
import { generateJWT } from "../../utils/crypto";
import config from 'config';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingUser = await getModel().getByEmail(req.body.email)
        if (existingUser) {
            return next(createHttpError(BadRequest('User with this email is already exist')));
        }
        const user = await getModel().signUp(req.body);
        const jwt = generateJWT(user, config.get('app.jwt.secret'), config.get('app.jwt.expires'))
        res.status(StatusCodes.CREATED).json({ user, jwt })
    } catch (err) {
        return next(createHttpError(Unauthorized(ReasonPhrases.UNAUTHORIZED)));
    }
}

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getModel().signIn(req.body);
        if (!user) return next(createHttpError(Unauthorized(`Couldn't find username or password`)));
        if (user.isTemporaryPassword) {
            return next(createHttpError(Unauthorized('Temporary password detected. Please change your password.')));
        }
        const jwt = generateJWT(user, config.get('app.jwt.secret'), config.get('app.jwt.expires'))
        res.json({ jwt })
    } catch (err) {
        return next(createHttpError(Unauthorized(ReasonPhrases.UNAUTHORIZED)));
    }
}

export const patchPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const user = await getModel().getOne(id);
        if (!user) return next(createHttpError(Unauthorized(`Couldn't find username or password`)));
        const existingPassword = await getModel().getOne(id);
        const updatedPassword = { ...existingPassword, ...req.body };
        await getModel().updatePassword(updatedPassword);
        res.status(StatusCodes.OK).json(updatedPassword)
    } catch (err) {
        next(err)
    }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await getModel().getByEmail(email);
        if (!user) return next(createHttpError(NotFound("User with this email not found")));
        await getModel().forgotPassword(user);
        res.status(StatusCodes.OK).json({ message: "Password reset email sent successfully" });
    } catch (err) {
        next(err);
    }
};