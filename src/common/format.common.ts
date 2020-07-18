/**
 * @file format.common
 * @description defines common formats for notification and emails
 * @created 2019-07-04 22:34:19
 * @author Desk Now Dev Team
*/

import { BASE } from "./config.common";

const EMAIL = {
    ADMIN: {
        PASSWORD_CHANGE: (reciever: string) => ({
            to: reciever,
            subject: 'Password Change Successful',
            text: 'You have successfully changed your password.'
        }),
        FORGOT_PASSWORD: (reciever: string, payload: any) => ({
            to: reciever,
            subject: 'Forgot Password',
            html: `Hello, <br/><br/>Please click on this link to reset your password: <a href="${BASE.ADMIN}/account/reset-password/${payload.metaToken.value}">here</a>`
        }),
        FORGOT_PASSWORD_NEW: (reciever: string, html:any) => ({
            to: reciever,
            subject: 'Forgot Password',
            html: html
        }),
        RESET_PASSWORD: (reciever: string) => ({
            to: reciever,
            subject: 'Password Reset Successful',
            text: `You have successfully resetted your password.`
        }),
        USER_CREDENTIALS: (reciever: string, password: string) => ({
            to: reciever,
            subject: 'Password Reset Successful',
            html: `Hello, <br/><br/>You have been onboarded to Desk Now.<br/><br/>
            Your Credentials are<br/><br/></b>Email:${reciever}<br/><br/>Password:${password}`
        }),
    },
    USER: {
        FORGOT_PASSWORD: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'Forgot Password',
            html: html
        }),
        SIGNUP_OTP: (reciever: string, payload: any) => ({
            to: reciever,
            subject: 'User SignUp',
            html: `Hello, <br/><br/>Your one time passcode is: ${payload.otp}`
        }),
        NEW_SIGNUP_OTP: (reciever: string, html: any) => ({
            to: reciever,
            subject: 'User SignUp',
            html: html
        }),

    }
}


export const FORMAT = {
    EMAIL
}
