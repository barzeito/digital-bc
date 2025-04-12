import Joi from "joi"
import DTO from '../../models/businessCards/dto';
import userDTO from "../../models/auth/user-dto";

export const addCardValidator = Joi.object<DTO>({
    company: Joi.string().min(4).required(),
    description: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^0\d{1,2}-?\d{7}$/).min(10).max(15).required(),
    website: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i).optional(),
    address: Joi.string().min(4).optional(),
    ownedBy: Joi.string().optional(),
});

export const patchCardValidator = Joi.object<DTO>({
    company: Joi.string().min(4),
    description: Joi.string().min(6),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\d+$/).min(10).max(15),
    website: Joi.string().uri().optional(),
    address: Joi.string().min(2).optional(),
});