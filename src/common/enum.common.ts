/**
 * @name enum.common
 * @description defines enum values 
 * @created 2019-05-07 21:24:20
 * @author Desk Now Dev Team
*/

export const ENUM = {
    LOGIN_TYPE: {
        FACEBOOK: "facebook",
        GOOGLE: "google",
        APPLE: "apple"
    },
    ADMIN: {
        TYPE: { SUPER_ADMIN: 'super', SUB_ADMIN: 'sub' },
        DEVICE_PLATFORM: { WEB: 'web' },
        VALUE: 'ADMIN'
    },

    USER: {
        STATUS: { ACTIVE: 'active', BLOCK: 'block' },
        TYPE: { BASIC: 'basic', ELITE: 'elite' },
        GENDER: { MALE: 'male', FEMALE: 'female', OTHER: 'other' }
    },
    USER_SESSION: {
        PLATFORM: { IOS: 'ios', ANDROID: 'android' }
    },

    COL: {
        ADMIN: 'admins',
        ADMIN_SESSION: 'admin_sessions',
        USER_SESSION: 'user_session',
        USER: 'users',
        CHAT:"chat",
        GROUP:"groups"
    },
    REDIS: {
        KEY: {

        },

    },
    FILTER_BY: {
        KEYS: {
            ACTIVE: "active",
            INACTIVE: "inactive",
        }
    },
    SORT_BY: {
        KEYS: {
            NAME: "name",
            CREATEDAT: "createdAt"
        }
    },
    MEDIA_TYPE: {
        KEYS: {
            IMAGE: "image",
            VIDEO: "video"
        }
    },
    
}

// array of enum values, requires ES2017 and above
export const ENUM_ARRAY = {
    ADMIN: {
        TYPE: Object.values(ENUM.ADMIN.TYPE),
        DEVICE_PLATFORM: Object.values(ENUM.ADMIN.DEVICE_PLATFORM),
    },
    USER: {
        STATUS: Object.values(ENUM.USER.STATUS),
        TYPE: Object.values(ENUM.USER.TYPE),
        GENDER: Object.values(ENUM.USER.GENDER)
    },
    USER_SESSION: {
        PLATFORM: Object.values(ENUM.USER_SESSION.PLATFORM)
    },
    SOCIAL_LOGIN_TYPE: {
        PLATFORM: Object.values(ENUM.LOGIN_TYPE)
    },
    FILTERBY: {
        KEYS: Object.values(ENUM.FILTER_BY.KEYS)
    },
    SORT_BY: {
        KEYS: Object.values(ENUM.SORT_BY.KEYS)
    },
    MEDIA_TYPE: {
        KEYS: Object.values(ENUM.MEDIA_TYPE.KEYS)
    }



}