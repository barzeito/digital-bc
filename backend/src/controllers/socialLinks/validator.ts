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
    facebook: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i).optional().allow(null),
    instagram: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i).optional().allow(null),
    linkedin: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i).optional().allow(null),
    twitter: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i).optional().allow(null),
    whatsapp: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i).optional().allow(null),
    email: Joi.string().email().optional().allow(null),
    map: Joi.string().optional().allow(null),
    phone: Joi.string().optional().allow(null),
    tiktok: Joi.string().pattern(/^((https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i).optional().allow(null),
});