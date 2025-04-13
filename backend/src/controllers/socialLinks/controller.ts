import { NextFunction, Request, Response } from "express";
import getModel from "../../models/socialLinks/factory";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

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
        const slink = await getModel().getOne(req.params.company_id);
        if (!slink) return next();
        res.json(slink)
    } catch (err) {
        next(err)
    }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingSocial = await getModel().getOne(req.body.company_id);
        if (existingSocial) {
            throw new Error('Company social already exists.');
        }
        const social = await getModel().create(req.body)
        res.status(StatusCodes.CREATED).json({ social })
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
        const id = req.params.company_id;
        const existingLink = await getModel().getOne(id);
        const updatedLink = { ...existingLink, ...req.body };
        await getModel().update(updatedLink);
        res.status(StatusCodes.OK).json(updatedLink)
    } catch (err) {
        next(err)
    }
}