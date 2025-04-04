import Joi from "joi"
import DTO from "../../models/socialLinks/dto";

export const addSocialValidator = Joi.object<DTO>({
    company_id: Joi.string().uuid().required(),
    company: Joi.string().min(2).required(),
    platform: Joi.string().min(3).required(),
    url: Joi.string().uri().required(),
});

export const patchSocialValidator = Joi.object<DTO>({
    company_id: Joi.string().uuid().required(),
    company: Joi.string().min(2).required(),
    platform: Joi.string().min(3).required(),
    url: Joi.string().uri().required(),
});