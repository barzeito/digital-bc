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

// export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const isDeleted = await getModel().deleteCard(req.params.id)
//         if (!isDeleted) return next(createHttpError(NotFound(`Card with id ${req.params.id} is not found!`)));
//         res.sendStatus(StatusCodes.NO_CONTENT)
//     } catch (err) {
//         next(err)
//     }
// }

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = req.params.id;
//         const updatedCard = { id, ...req.body }
//         const card = await getModel().update(updatedCard);
//         console.log(card)
//         res.json(convertCardToImageUrl(card));
//     } catch (err) {
//         next(err)
//     }
// }


// export const patch = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = req.params.id;
//         const existingCard = await getModel().getOneById(id);
//         const updatedCard = { ...existingCard, ...req.body };
//         const card = await getModel().update(updatedCard);
//         res.status(StatusCodes.OK).json(convertCardToImageUrl(card))
//     } catch (err) {
//         next(err)
//     }
// }

// export const getUserCards = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userId = req.params.userId;
//         if (!userId) {
//             return res.status(400).json({ message: 'User ID is required' });
//         }
//         const cards = await getModel().getUserCards(userId);
//         if (!cards) {
//             return res.status(404).json({ message: 'No cards found for this user' });
//         }
//         res.json(cards);
//     } catch (err) {
//         next(err);
//     }
// }

// export const assignCardOwner = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const cardId = req.params.id;
//         const userId = req.body.ownedBy;
//         const existingCard = await getModel().getOneById(cardId);
//         if (!existingCard) {
//             throw new Error("Card not found");
//         }

//         const updatedCard = await getModel().assignCardOwner(cardId, userId);
//         res.status(StatusCodes.OK).json(updatedCard);
//     } catch (err) {
//         next(err);
//     }
// };
