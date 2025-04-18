import Joi from "joi"
import DTO from '../../models/businessCards/dto';

export const addCardValidator = Joi.object<DTO>({
    company: Joi.string().min(2).required(),
    name: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
    about: Joi.string().allow("").optional(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^0\d{1,2}-?\d{7}$/).min(10).max(15).required(),
    website: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i).allow("").optional(),
    address: Joi.string().min(4).optional(),
    ownedBy: Joi.string().optional(),
    coverImageFile: Joi.object({
        mimetype: Joi.string().valid('image/jpg', 'image/jpeg', 'image/png')
    }).unknown(true).optional(),
});

export const patchCardValidator = Joi.object<DTO>({
    company: Joi.string().min(2),
    name: Joi.string().min(2),
    description: Joi.string().min(2),
    about: Joi.string().min(2),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\d+$/).min(10).max(15),
    website: Joi.string().uri().optional(),
    address: Joi.string().min(2).optional(),
});