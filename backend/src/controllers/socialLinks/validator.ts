import Joi from "joi"
import DTO from "../../models/socialLinks/dto";

// export const addSocialValidator = Joi.object<DTO>({
//     company_id: Joi.string().uuid().required(),
//     company: Joi.string().min(2).required(),
//     platform: Joi.string().min(3).required(),
//     url: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i).required(),

// });

export const patchSocialValidator = Joi.object({
    id: Joi.string().optional(),
    company_id: Joi.string().uuid(),
    company: Joi.string().min(2).optional(),
    facebook: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i),
    instagram: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i),
    linkedin: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i),
    twitter: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i),
    whatsapp: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i),
    email: Joi.string().email().optional(),
    map: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i),
    phone: Joi.string().optional(),
    tiktok: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i),
});