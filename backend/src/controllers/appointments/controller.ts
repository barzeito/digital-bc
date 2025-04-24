import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import createHttpError, { BadRequest, NotFound, Unauthorized } from "http-errors";
import getModel from "../../models/appointments/factory";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apps = await getModel().getAll();
        res.json(apps)
    } catch (err) {
        next(err)
    }
}

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const app = await getModel().getOne(req.params.id);
        if (!app) return next();
        res.json(app)
    } catch (err) {
        next(err)
    }
}

export const getOneById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const app = await getModel().getOneByCompanyId(req.params.company_id);
        if (!app) return next();
        res.json(app)
    } catch (err) {
        next(err)
    }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingCompany = await getModel().getOneByCompanyId(req.body.company_id)
        if (existingCompany) {
            if (existingCompany) {
                return res.status(400).json({
                    message: 'Company appointments table already exists.',
                    code: 'COMPANY_APPOINTMENTS_EXISTS'
                });
            }
        }
        const app = await getModel().add(req.body);
        res.status(StatusCodes.CREATED).json(app)
    } catch (err) {
        console.log(err)
        next(err)
    }
}

export const patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.company_id;
        const existingApp = await getModel().getOneByCompanyId(id);
        const updatedApp = { ...existingApp, ...req.body };
        const app = await getModel().update(updatedApp);
        res.status(StatusCodes.OK).json(app)
    } catch (err) {
        next(err)
    }
}

export const addAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { company_id } = req.params;
        const appointment = req.body;
        const date = appointment.date;

        await getModel().addBookedAppointment(company_id, date, appointment);

        res.status(StatusCodes.OK).json({ message: "התור הוזמן בהצלחה" });
    } catch (err) {
        console.error("Error occurred:", err);
        next(err);
    }
}

export const getAvailableTimes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const app = await getModel().getAvailableTimes(req.params.company_id);
        if (!app) return next();
        res.json(app)
    } catch (err) {
        next(err)
    }
}