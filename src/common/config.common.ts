/**
 * @file config.common
 * @description defines configuration for application
 * @created 2019-05-08 23:39:56
 * @author Desk Now Dev Team
*/

import dotenv from "dotenv";

// system error message codes for debugging
export const SYS_ERR = {
    NODE_ENV_INVALID: 100,
    BOOTSTRAP_ERROR: 101,
    MONGO_CONN_FAILED: 103
}

// check if NODE_ENV exists, else throw an error
if (typeof process.env.NODE_ENV === 'undefined') process.exit(SYS_ERR.NODE_ENV_INVALID);

// configure the environment
dotenv.config({ path: `bin/.env.${process.env.NODE_ENV}` });

// configurations and credentails goes in here
export const CONFIG = {
    NODE_ENV: process.env.NODE_ENV,
    DB_URI: <string>process.env.DB_URI,
    APP_PORT: process.env.PORT,
    SOCKET_PORT: process.env.SOCKET_PORT,
    DB_POOLSIZE: 50,
    JWT_PASSWORD: 'qwerty',
    SYS_EMAIL: <string>process.env.SYS_EMAIL,
    SYS_PASSWORD: <string>process.env.SYS_PASSWORD,
    FCM_PHOTOLOOT_JSON: 'bin/photoloot.json',
    AWS: {
        BUCKET: <string>process.env.AWS_BUCKET,
        ACCESS_KEY: <string>process.env.AWS_ACCESS_KEY,
        SECRET_KEY: <string>process.env.AWS_SECRET_KEY,
        REGION: <string>process.env.AWS_REGION,
        BASE_URL: <string>process.env.AWS_URL + <string>process.env.AWS_BUCKET + '/'
    },
    SNS: {
        ACCESS_KEY: <string>process.env.SNS_ACCESS_KEY_ID,
        SECRET_KEY: <string>process.env.SNS_SECRET_ACCESS_KEY,
        REGION: <string>process.env.SNS_REGION
    },
    FCM:{
        SERVER_KEY: <string>process.env.FCM_SERVER_KEY
    }
   
}

export const BASE = {
    URL: <string>process.env.BASE_URL,
    ADMIN: <string>process.env.BASE_ADMIN_URL,
    AWS: {
        IMAGE_PATH: 'desk_new/images/',
        AR_MODEL_PATH: 'desk_new/models/',
    },
    ANDROID: process.env.ANDROID_URL
}