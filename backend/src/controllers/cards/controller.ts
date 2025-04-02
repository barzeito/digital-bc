import { NextFunction, Request, Response } from "express";
import getModel from "../../models/businessCards/factory";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import config from 'config';
import createHttpError, { NotFound, Unauthorized } from "http-errors";

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
        const card = await getModel().add(req.body);
        res.status(StatusCodes.CREATED).json(card)
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
        await getModel().update(updatedCard);
        res.status(StatusCodes.OK).json(updatedCard)
    } catch (err) {
        next(err)
    }
}