import { NextFunction, Request, Response } from "express";
import getModel from "../../models/socialLinks/factory";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import config from 'config';
import createHttpError, { NotFound, Unauthorized } from "http-errors";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slinks = await getModel().getAll();
        res.json(slinks)
    } catch (err) {
        next(err)
    }
}

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slink = await getModel().getOne(req.params.id);
        if (!slink) return next();
        res.json(slink)
    } catch (err) {
        next(err)
    }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slink = await getModel().add(req.body);
        res.status(StatusCodes.CREATED).json(slink)
    } catch (err) {
        next(err)
    }
}

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isDeleted = await getModel().deleteSocial(req.params.id)
        if (!isDeleted) return next(createHttpError(NotFound(`SocialLink with id ${req.params.id} is not found!`)));
        res.sendStatus(StatusCodes.NO_CONTENT)
    } catch (err) {
        next(err)
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const updatedSlink = { id, ...req.body }
        const slink = await getModel().update(updatedSlink);
        res.json(slink);
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