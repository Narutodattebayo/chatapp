// /**
//  * @file common.admin.controller
//  * @description defines admin common controller methods
//  * @author Desk Now Dev Team
// */

// import { Request, Response, NextFunction } from "express";
// import { ApiPath, ApiOperationPost, ApiOperationGet } from "swagger-express-ts";
// import { AdminV1, } from "@entity";
// import BaseClass from "@baseController";
// import { SUCCESS, FORMAT, RESPONSE, CONSTANT, BASE } from "@common";
// import { Auth, Mailer } from "@services";
// import { Helper } from "../../services/helper.service";
// import { TEMPLATER } from "../../htmlHelper";
// // import {  ApiOperationPost } from "swagger-express-ts";

// @ApiPath({
//     path: "/api/admins",
//     name: "Admin Onboarding Module",
//     security: { apiKeyHeader: [] },
// })
// class AdminCommonClass extends BaseClass {

//     constructor() {
//         super();
//     }

//     /**
//      * @method post
//      * @description logs in the admin
//      * @author Desk Now Dev Team
//      */

//     @ApiOperationPost({
//         description: "User Verify Otp",
//         path: '/login',
//         parameters: {

//             body: {
//                 description: 'Body for veriy otp',
//                 required: true,
//                 model: 'ReqAdminLogin'
//             }
//         },
//         responses: {
//             200: {
//                 description: "Success",
//                 type: "String",
//             }
//         },
//     })
//     async adminLogin(req: Request, res: Response, next: NextFunction) {
//         try {
//             let payload = req.body,
//                 checkAdminExists = await AdminV1.findOne<IAdmin.Admin>({ email: payload.email });

//             if (checkAdminExists) {
//                 if (await AdminV1.verifyPassword(checkAdminExists, payload.password)) {
//                     payload.adminId = checkAdminExists._id;

//                     // update admin last login and create new session
//                     let [adminData, sessionData] = await Promise.all([
//                         AdminV1.updateEntity<IAdmin.Admin>({ _id: checkAdminExists._id },
//                             { $set: { 'adminMeta.lastLogin': new Date() } }
//                         ),
//                         AdminV1.createNewSession(payload)
//                     ]);

//                     this.sendResponse(res, SUCCESS.DEFAULT, {
//                         adminData: AdminV1.filterAdminData(adminData.data as IAdmin.Admin),
//                         authToken: Auth.generateAdminJWT(sessionData._id)
//                     });
//                 } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).INCORRECT_PASSWORD);
//             } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).EMAIL_NOT_EXISTS);
//         } catch (err) {
//             next(err);
//         }
//     }

//     /**
//      * @method patch
//      * @description admin forgot password, sends email to admin
//      * @author Desk Now Dev Team
//      * @todo-action send an email
//      */
//     @ApiOperationPost({
//         description: "User Verify Otp",
//         path: '/password/forgot',
//         parameters: {

//             body: {
//                 description: 'Body for veriy otp',
//                 required: true,
//                 model: 'ReqAdminForgotPassword'
//             }
//         },
//         responses: {
//             200: {
//                 description: "Success",
//                 type: "String",
//             }
//         },
//     })
//     async forgotPassword(req: Request, res: Response, next: NextFunction) {
//         try {
//             let payload = req.body,
//                 singleAdminData = await AdminV1.findOne<IAdmin.Admin>({ email: payload.email });

//             if (singleAdminData) {
//                 let metaToken = Helper.generateMetaToken();
//                 await AdminV1.updateEntity<IAdmin.Admin>(
//                     { _id: singleAdminData._id },
//                     { 'adminMeta.token': metaToken },
//                 );
//                 this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).EMAIL_SENT);

//                 // Mailer.sendMail(FORMAT.EMAIL.ADMIN.FORGOT_PASSWORD(singleAdminData.email, { metaToken }));
//                 let html = await TEMPLATER.makeHtmlTemplate(`${CONSTANT.EMAIL_TEMPLATES}` + `adminforgetpassword.html`, { name: singleAdminData.name, ASSET_PATH: BASE.URL, url: `${BASE.ADMIN}/account/reset-password/${metaToken.value}` });
//                 Mailer.sendMail(FORMAT.EMAIL.ADMIN.FORGOT_PASSWORD_NEW(payload.email, html));

//             } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).EMAIL_NOT_EXISTS);
//         } catch (err) {
//             next(err);
//         }
//     }

//     /**
//      * @method get
//      * @description verifies the authenticity of meta token
//      * @author Desk Now Dev Team
//      */
//     @ApiOperationGet({
//         description: "User Verify Otp",
//         path: '/password/verify/{metaToken}',
//         parameters: {
//             path: {
//                 metaToken: {
//                     description: 'metatoken',
//                     required: true,
//                 }
//             },
//             query: {
//                 email: {
//                     description: 'email',
//                 }
//             }

//         },
//         responses: {
//             200: {
//                 description: "Success",
//                 type: "String",
//             }
//         },
//     })
//     async verifyMetaToken(req: Request, res: Response, next: NextFunction) {
//         try {
//             let metaToken = req.params.metaToken,
//                 checkValidToken = await AdminV1.findOne<IAdmin.Admin>(
//                     { 'adminMeta.token.value': metaToken }
//                 );
//             if (checkValidToken && checkValidToken.adminMeta.token) {
//                 if (checkValidToken.adminMeta.token.time > new Date()) {
//                     this.sendResponse(res, SUCCESS.DEFAULT);
//                 } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).TOKEN_EXPIRED);
//             } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).TOKEN_INCORRECT);
//         } catch (err) {
//             next(err);
//         }
//     }

//     /**
//      * @method patch
//      * @description resets admin password with the new password
//      * @author Desk Now Dev Team
//      * @todo-action send password change email
//      */
//     @ApiOperationPost({
//         description: "User Verify Otp",
//         path: '/password/reset/{metaToken}',
//         parameters: {
//             path: {
//                 metaToken: {
//                     description: 'metatoken',
//                     required: true,
//                 }
//             },
//             body: {
//                 description: 'Body for admin reset password',
//                 required: true,
//                 model: 'ReqAdminResetPassword'
//             }

//         },
//         responses: {
//             200: {
//                 description: "Success",
//                 type: "String",
//             }
//         },
//     })
//     async resetPassword(req: Request, res: Response, next: NextFunction) {
//         try {
//             let metaToken = req.params.metaToken,
//                 payload = req.body,
//                 checkValidToken = await AdminV1.findOne<IAdmin.Admin>(
//                     { 'adminMeta.token.value': metaToken }
//                 );
//             if (checkValidToken && checkValidToken.adminMeta.token) {
//                 if (checkValidToken.adminMeta.token.time > new Date()) {
//                     await AdminV1.updateEntity<IAdmin.Admin>(
//                         { _id: checkValidToken._id },
//                         {
//                             password: Auth.hashData(payload.password, checkValidToken.salt),
//                             'adminMeta.token': {}
//                         },
//                     );
//                     this.sendResponse(res, SUCCESS.DEFAULT);
//                     // Mailer.sendMail(FORMAT.EMAIL.ADMIN.RESET_PASSWORD(checkValidToken.email));
//                 } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).TOKEN_EXPIRED);
//             } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).TOKEN_INCORRECT);
//         } catch (err) {
//             next(err);
//         }
//     }

//     /**
//      * @method patch
//      * @description logs out the admin from current session
//      * @author Desk Now Dev Team
//      */
//     async adminLogout(req: Request, res: Response, next: NextFunction) {
//         try {
//             let adminId = res.locals.adminId,
//                 adminSessionId = res.locals.adminSessionId,
//                 checkAdminExists = await AdminV1.findOne<IAdmin.Admin>({ _id: adminId });

//             if (checkAdminExists) {
//                 await AdminV1.removePreviousSession(adminSessionId, false);
//                 this.sendResponse(res, SUCCESS.DEFAULT);
//             } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).NOT_FOUND);
//         } catch (err) {
//             next(err);
//         }
//     }


// }

// export const AdminCommonController = new AdminCommonClass();