/**
 * @file user.response
 * @description defines response for user entity
 * @created 2019-08-29 00:39:36
 * @author Desk Now Dev Team
 * @meta Response Code: 50XX, 51XX
*/

import HTTP from "./code.response";

export const MSG: any = {
    EN: {
        NOT_FOUND: 'User not found',
        SIGNUP_SUCCESSFULLY: "Signup successfully, One time passcode sent to your email id .",
        EMAIL_ALREADY_EXISTS: "Email already exists",
        INVALID_OTP: "Otp is invalid",
        EMAIL_NOT_VERIFIED: "Please verify your email",
        INVALID_CREDENTIALS:"Invalid credentials"
    },
    FR: {
        SIGNUP_SUCCESSFULLY: `inscription réussie`,
    }
}

export default (lang: string) => ({
    SIGNUP_SUCCESSFULLY: { httpCode: HTTP.SUCCESS, statusCode: 200, message: MSG[lang].SIGNUP_SUCCESSFULLY },
    EMAIL_ALREADY_EXISTS: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].EMAIL_ALREADY_EXISTS },
    INVALID_OTP: { httpCode: HTTP.BAD_REQUEST, statusCode: 400, message: MSG[lang].INVALID_OTP },
    NOT_FOUND: { httpCode: HTTP.NOT_FOUND, statusCode: 404, message: MSG[lang].NOT_FOUND },
    EMAIL_NOT_VERIFIED: { httpCode: HTTP.NOT_FOUND, statusCode: 400, message: MSG[lang].EMAIL_NOT_VERIFIED },
    INVALID_CREDENTIALS: { httpCode: HTTP.NOT_FOUND, statusCode: 400, message: MSG[lang].INVALID_CREDENTIALS },
});





export const CUSTOM_SUCCESS = (data?: any, message?: string) => {
    return ({
        httpCode: 200,
        statusCode: 200,
        message: message ? message : "Success",
        data: data ? data : {}
    })

}

export const CUSTOM_ERROR = (data?: any, message?: string) => {
    return ({
        httpCode: 400,
        statusCode: 400,
        message: message ? message : "Success",
        data: data ? data : {}
    })

}

