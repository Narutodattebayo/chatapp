/**
 * @file user.v1.routes
 * @description defines routing for v1 user routes
 * @author Desk Now Dev Team
*/

import { celebrate, Joi } from "celebrate";
import { Router, Request, Response, NextFunction } from "express";

import BaseRoute from "@baseRoute";
import { VALIDATION } from "@common";
import { UserController } from "@controllers";
import Middlewares from "@middlewares";

class V1UserRouteClass extends BaseRoute {

    public path: string;

    constructor(path: string) {
        super();
        this.path = path;
        this.initRoutes();
    }

    get instance(): Router {
        return this.router;
    }

    initRoutes() {

        /** User SignUp */
        this.router.post('/signup',
            celebrate({
                body: {
                    name: VALIDATION.USER.NAME.required(),
                    email: VALIDATION.USER.EMAIL.required(),
                    password: VALIDATION.USER.PASSWORD,
                    // countryCode: VALIDATION.USER.COUNTRY_CODE,
                    // phoneNo: VALIDATION.USER.PHONE,
                    image: VALIDATION.USER.IMAGE.allow(null, ""),
                    // language:Joi.string().optional()
                }
            }),
            (req: Request, res: Response, next: NextFunction) => {
                console.log('in Route');
                UserController.userSignUp(req, res, next);
            }
        );

        this.router.post('/verifyOtp',
            celebrate({
                body: {
                    otp: VALIDATION.USER.OTP.required(),
                    email: VALIDATION.USER.EMAIL.required(),

                }
            }),
            (req: Request, res: Response, next: NextFunction) => {
                console.log('in Route');
                UserController.verifyOtp(req, res, next);
            }
        );


        this.router.post('/login',
            celebrate({
                body: {
                    email: VALIDATION.USER.EMAIL.required(),
                    password: VALIDATION.USER.PASSWORD.required(),
                }
            }),
            (req: Request, res: Response, next: NextFunction) => {
                console.log('in Route');
                UserController.userLogin(req, res, next);
            }
        );

        this.router.get('/logout',
            Middlewares.VerifyUserSession,
            (req: Request, res: Response, next: NextFunction) => {
                console.log('in Route');
                UserController.logout(req, res, next);
            }
        );



        this.router.get('/pendingMessages',
            Middlewares.VerifyUserSession,
            (req: Request, res: Response, next: NextFunction) => {
                console.log('in Route');
                UserController.myPendingMessages(req, res, next);
            }
        );

        this.router.get('/allUsers',
            celebrate({
                query: {
                    ...VALIDATION.GENERAL.PAGINATION

                }
            }),
            Middlewares.VerifyUserSession,
            (req: Request, res: Response, next: NextFunction) => {
                console.log('in Route');
                UserController.allUsers(req, res, next);
            }
        );

        this.router.get('/allChats',
            celebrate({
                query: {
                    ...VALIDATION.GENERAL.PAGINATION

                }
            }),
            Middlewares.VerifyUserSession,
            (req: Request, res: Response, next: NextFunction) => {
                console.log('in Route');
                UserController.allChats(req, res, next);
            }
        );

        this.router.get('/createGroup',
            celebrate({
                query: {
                    name: Joi.string().min(1).required()
                }
            }),
            Middlewares.VerifyUserSession,
            (req: Request, res: Response, next: NextFunction) => {
                console.log('in Route');
                UserController.newGroup(req, res, next);
            }
        );










    }
}

export default new V1UserRouteClass('/');