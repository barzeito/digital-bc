import Joi from "joi"
import DTO from '../../models/businessCards/dto';

export const addCardValidator = Joi.object<DTO>({
    company: Joi.string().min(4).required(),
    description: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\d+$/).min(10).max(15).required(), 
    website: Joi.string().uri().optional(),
    address: Joi.string().min(2).optional(),
});