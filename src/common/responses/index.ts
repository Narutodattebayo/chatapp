/**
 * @file common/responses
 * @description exposes all the responses objects
 * @created 2019-05-15 00:15:04
 * @author Desk Now Dev Team
*/


import USER from "./user.response";
import ADMIN from "./admin.response";

export const SUCCESS = {
    DEFAULT: {
        httpCode: 200,
        statusCode: 200,
        message: 'Success'
    },
    CAR_EDIT:{
        httpCode: 200,
        statusCode: 200,
        message: 'Car details updated successfully'
    }

}

export const CUSTOM_ERROR = (data?: any, message?: string) => {
    return ({
        httpCode: 400,
        statusCode: 400,
        message: message ? message : "Success",
        data: data ? data : {}
    })

}





export const RESPONSE = {
    ADMIN,
    USER
}


