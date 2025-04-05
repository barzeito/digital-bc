import { NextFunction, Request, Response } from "express";
import getModel from "../../models/businessCards/factory";
import getAuthModel from "../../models/auth/factory";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import createHttpError, { BadRequest, NotFound, Unauthorized } from "http-errors";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cards = await getModel().getAll();
        res.json(cards)
    } catch (err) {
        next(err)
    }
}

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const card = await getModel().getOne(req.params.company);
        if (!card) return next();
        res.json(card)
    } catch (err) {
        next(err)
    }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingCard = await getModel().getOne(req.body.company);
        if (existingCard) {
            throw new Error('Company name already exists.');
        }
        const existingUser = await getAuthModel().getByEmail(req.body.email)
        if (existingUser) {
            return next(createHttpError(BadRequest('User with this email is already exist')));
        }
        const card = await getModel().add(req.body);
        const user = await getAuthModel().signUp(req.body);
        res.status(StatusCodes.CREATED).json({ card, user })
    } catch (err) {
        next(err)
    }
}

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isDeleted = await getModel().deleteCard(req.params.id)
        if (!isDeleted) return next(createHttpError(NotFound(`Card with id ${req.params.id} is not found!`)));
        res.sendStatus(StatusCodes.NO_CONTENT)
    } catch (err) {
        next(err)
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const updatedCard = { id, ...req.body }
        const card = await getModel().update(updatedCard);
        res.json(card);
    } catch (err) {
        next(err)
    }
}


export const patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const existingCard = await getModel().getOne(id);
        const updatedCard = { ...existingCard, ...req.body };
        const card = await getModel().update(updatedCard);
        res.status(StatusCodes.OK).json(card)
    } catch (err) {
        next(err)
    }
}