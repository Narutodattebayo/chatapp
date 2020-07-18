/**
 * @file common/validations
 * @description exposes all the validation objects
 * @created 2019-05-14 23:49:42
 * @author Desk Now Dev Team
*/

import { Joi } from "celebrate";
//import { join } from "path";
import { ENUM_ARRAY } from "./enum.common"

export const VALIDATION = {
    ADMIN: {
        ID: Joi.string().regex(/^[a-f\d]{24}$/i),
        EMAIL: Joi.string().trim().email(),
        PASSWORD: Joi.string().min(6).max(32),
        NAME: Joi.string().trim().min(2).max(40),
        PROFILE_PHOTO: Joi.string().trim().uri(),
        META_TOKEN: Joi.string()
    },

    NOTIFICATION: {
        ID: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
        ID_OPTIONAL: Joi.string().regex(/^[a-f\d]{24}$/i),
    },


    USER: {
        NAME: Joi.string().min(3).max(40),
        EMAIL: Joi.string().trim().email().max(40),
        PASSWORD: Joi.string().min(8).max(15),
        COUNTRY_CODE: Joi.string().allow("", null),
        PHONE: Joi.string().min(8).max(15).allow("", null),
        IMAGE: Joi.string().allow("", null),
        OTP: Joi.string(),
        DEVICE: Joi.object().keys({
            platform: Joi.string(),
            token: Joi.string()
        }),
        RESET_TOKEN: Joi.string(),
        SOCIAL_LOGIN_TYPE: Joi.string().required().valid(ENUM_ARRAY.SOCIAL_LOGIN_TYPE.PLATFORM),
        SOCIAL_ID: Joi.string().required(),
        STATUS: Joi.string(),
        SORT: Joi.string().valid(ENUM_ARRAY.SORT_BY),
        ID: Joi.string().regex(/^[a-f\d]{24}$/i),
        TYPE: Joi.string().optional().valid(ENUM_ARRAY.USER.TYPE),
        CITY: Joi.string().allow(null, ""),
        BIO: Joi.string().allow(null, "").optional().max(50),
        GENDER: Joi.string().optional().valid(ENUM_ARRAY.USER.GENDER),
        LATITUDE: Joi.number().min(-90).max(90),
        LONGITUDE: Joi.number().min(-180).max(180),
    },

    HISTORY: {
        SEARCH_TYPE: Joi.string().required().valid('event', 'user'),
        ID: Joi.string().regex(/^[a-f\d]{24}$/i),
    },

    GENERAL: {
        ANY: Joi.any(),
        BOOLEAN: Joi.boolean(),
        STRING: Joi.string(),
        PAGINATION: {
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(3).max(100).default(10).optional(),
            search: Joi.string().trim().optional(),

        },
        NUMBER: Joi.number(),
        REF: (key: string) => Joi.ref(key)
    },

    FILTER: {
        KEY: Joi.array().items(Joi.string().valid(ENUM_ARRAY.FILTERBY.KEYS))
    },
    SORT: {
        KEY: Joi.string().valid(ENUM_ARRAY.SORT_BY.KEYS)
    },
    
   


}