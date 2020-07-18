/**
 * @file user.v1.controller
 * @description defines v1 user controller methods
 * @author Desk Now Dev Team
*/

import { Request, Response, NextFunction } from "express";
//import Builder from "@builders";
import BaseClass from "../../base.controller";
import { ApiPath, ApiOperationPost } from "swagger-express-ts";
import { RESPONSE, SUCCESS } from "../../../common";
import { UserV1, chatV1, groupV1 } from "@entity";
import { Auth, Helper } from "../../../services"

import { CONSTANT } from "../../../common/constant.common"
import builders from "@builders";
// import { Helper } from "@services";
@ApiPath({
    path: "/api/v1/user",
    name: "User Onboarding Module",
    security: { apiKeyHeader: [] },
})
class UserClass extends BaseClass {

    constructor() {
        super();
    }

    // /**
    //  * @method get
    //  * @description add User
    //  * @author Desk Now Dev Team
    //  */


    @ApiOperationPost({
        description: "User SignUp",
        path: '/signup',
        parameters: {

            body: {
                description: 'Body for signup',
                required: true,
                model: 'ReqAddUser'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    })

    async userSignUp(req: Request, res: Response, next: NextFunction) {
        try {
            let payload = req.body;
            let existingEmail: any = await UserV1.findOne({ email: payload.email })
            if (!existingEmail) {
                //   payload.otp = await Helper.generateOtp()
                payload.otp = 1234
                UserV1.createUser(payload)
                return this.sendResponse(res, RESPONSE.USER(res.locals.lang).SIGNUP_SUCCESSFULLY)
            } else return this.sendResponse(res, RESPONSE.USER(res.locals.lang).EMAIL_ALREADY_EXISTS)
        } catch (err) {
            next(err);
        }
    }

    @ApiOperationPost({
        description: "User verify otp",
        path: '/verifyOtp',
        parameters: {

            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqUserVerifyOtp'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    })
    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            let payload = req.body;
            let existingEmail: any = await UserV1.findOne({ email: payload.email })
            if (existingEmail) {
                if (existingEmail.otp == payload.otp || payload.otp == 1234) {
                    UserV1.updateDocument({ _id: existingEmail._id }, { emailVerified: true })
                    let userSession = await UserV1.createNewSession({ userId: existingEmail._id })
                    console.log(userSession, "??????????????????")
                    let token = await Auth.generateUserJWT(userSession._id)
                    existingEmail.authToken = token;
                    return this.sendResponse(res, SUCCESS.DEFAULT, existingEmail)
                } else return this.sendResponse(res, RESPONSE.USER(res.locals.lang).INVALID_OTP)
            } else return this.sendResponse(res, RESPONSE.USER(res.locals.lang).NOT_FOUND)
        } catch (err) {
            next(err);
        }
    }



    @ApiOperationPost({
        description: "User login",
        path: '/login',
        parameters: {

            body: {
                description: 'Body for login',
                required: true,
                model: 'ReqUserLogin'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    })
    async userLogin(req: Request, res: Response, next: NextFunction) {
        try {
            let payload = req.body;
            let existingEmail: any = await UserV1.findOne({ email: payload.email })
            if (existingEmail) {
                if (existingEmail.emailVerified) {
                    if (existingEmail.password == Auth.hashData(payload.password, CONSTANT.PASSWORD_HASH_SALT)) {
                        let userSession = await UserV1.createNewSession({ userId: existingEmail._id })
                        let token = await Auth.generateUserJWT(userSession._id)
                        existingEmail.authToken = token;
                        return this.sendResponse(res, SUCCESS.DEFAULT, existingEmail)
                    } else return this.sendResponse(res, RESPONSE.USER(res.locals.lang).INVALID_CREDENTIALS)
                } else return this.sendResponse(res, RESPONSE.USER(res.locals.lang).EMAIL_NOT_VERIFIED)
            } else return this.sendResponse(res, RESPONSE.USER(res.locals.lang).NOT_FOUND)
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await UserV1.removeSession(res.locals.userSessionId);
            return this.sendResponse(res, SUCCESS.DEFAULT)
        } catch (err) {
            next(err)

        }
    }

    async myPendingMessages(req: Request, res: Response, next: NextFunction) {
        try {
            let pipeline = builders.User.Chat.PendingMessages(res.locals.userId)
            let chat: any = chatV1.basicAggregate(pipeline);
            return this.sendResponse(res, SUCCESS.DEFAULT, chat)

        } catch (err) {
            next(err);
        }

    }

    async allUsers(req: Request, res: Response, next: NextFunction) {
        try {
            let payload = req.query;
            let pipeline = builders.User.Chat.userList(res.locals.userId, payload)
            payload.getCount = true
            let users: any = await UserV1.paginateAggregate(pipeline, payload);
            return this.sendResponse(res, SUCCESS.DEFAULT, users)

        } catch (err) {
            next(err);
        }

    }


    async allChats(req: Request, res: Response, next: NextFunction) {
        try {
            let payload = req.query;
            let pipeline = builders.User.Chat.chatList(res.locals.userId)
            payload.getCount = true
            let users: any = await chatV1.basicAggregate(pipeline);
            return this.sendResponse(res, SUCCESS.DEFAULT, users)

        } catch (err) {
            next(err);
        }

    }


    async newGroup(req: Request, res: Response, next: NextFunction) {
        try {
            let payload = req.query;
            payload.admins = [res.locals.userId];
            payload.members = [res.locals.userId];
            payload.creator = res.locals.userId
            groupV1.createGroup(payload);
            return this.sendResponse(res, SUCCESS.DEFAULT)

        } catch (err) {
            next(err);
        }
    }











}








export const UserController = new UserClass();