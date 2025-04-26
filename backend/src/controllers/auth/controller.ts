import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases, OK } from "http-status-codes";
import createHttpError, { BadRequest, NotFound, Unauthorized } from "http-errors";
import getModel from "../../models/auth/factory";
import { generateJWT } from "../../utils/crypto";
import config from 'config';


export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getModel().getAll()
        res.json(users)
    } catch (err) {
        next(err)
    }
}

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getModel().getOne(req.params.id)
        if (!user) return next();
        res.json(user)
    } catch (err) {
        next(err)
    }
}


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingUser = await getModel().getByEmail(req.body.email)
        if (existingUser) {
            return next(res.status(400).json({ message: 'Email already in use', code: 'EMAIL_EXISTS' }));
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
        if (!user) return next(res.status(400).json({ message: "שם משתמש או סיסמה שגויים" }));
        const jwt = generateJWT(user, config.get('app.jwt.secret'), config.get('app.jwt.expires'))
        const response = {
            jwt,
            user,
            isTemporaryPassword: user.isTemporaryPassword
        };
        if (user.isTemporaryPassword) {
            response['message'] = 'Temporary password detected. Please change your password.';
        }
        res.json(response);
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
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getModel().isAdmin(req.params.id);
        res.json(user);
    } catch (err) {
        console.error('Error checking admin status:', err);
        next(err)
    }
}

export const isPremium = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getModel().isPremium(req.params.id);
        res.json(user);
    } catch (err) {
        console.error('Error checking premium status:', err);
        next(err)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isDeleted = await getModel().deleteUser(req.params.id)
        if (!isDeleted) return next(createHttpError(NotFound(`User with id ${req.params.id} is not found!`)));
        res.sendStatus(StatusCodes.NO_CONTENT)
    } catch (err) {
        next(err)
    }
}

export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const existingUser = await getModel().getOne(id);
        if (!existingUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: `User with ID ${id} not found` });
        } const updatedUser = { ...existingUser, ...req.body };
        const user = await getModel().updateUser(updatedUser);
        res.status(StatusCodes.OK).json(user)
    } catch (err) {
        next(err)
    }
}