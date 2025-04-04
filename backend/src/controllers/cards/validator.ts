import Joi from "joi"
import DTO from '../../models/businessCards/dto';
import userDTO from "../../models/auth/user-dto";

export const addCardValidator = Joi.object<DTO & userDTO>({
    company: Joi.string().min(4).required(),
    description: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\d+$/).min(10).max(15).required(),
    website: Joi.string().uri().optional(),
    address: Joi.string().min(2).optional(),
    firstName: Joi.string().min(2).max(20).required().messages({
        'string.empty': 'First Name is required',
        'any.required': 'First Name is required',
        'string.min': 'First Name must be at least {#limit} characters long',
    }),
    lastName: Joi.string().min(2).max(20).required().messages({
        'string.empty': 'Last Name is required',
        'any.required': 'Last Name is required',
        'string.min': 'Last Name must be at least {#limit} characters long',
    })
});

export const patchCardValidator = Joi.object<DTO>({
    company: Joi.string().min(4).required(),
    description: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\d+$/).min(10).max(15).required(),
    website: Joi.string().uri().optional(),
    address: Joi.string().min(2).optional(),
});