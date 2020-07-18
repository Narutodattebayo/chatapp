// /**
//  * @file admin.controller
//  * @description defines admin controller methods
//  * @created 2019-08-01 00:31:33
//  * @author Desk Now Dev Team
// */

// import { Request, Response, NextFunction } from "express";
// import { ApiPath, ApiOperationPatch, ApiOperationGet } from "swagger-express-ts";
// import { AdminV1 } from "@entity";
// import BaseClass from "@baseController";
// import { Auth, Mailer } from "@services";
// import { SUCCESS, FORMAT, RESPONSE } from "@common";
// @ApiPath({
//     path: "/api/admins",
//     name: "Admin Module",
//     security: { apiKeyHeader: [] },
// })
// class AdminClass extends BaseClass {

//     constructor() {
//         super();
//     }

//     /**
//      * @method get
//      * @description gets the detail of single admin
//      * @author Desk Now Dev Team
//      */
//     @ApiOperationGet({
//         description: "User Verify Otp",
//         path: '/details',
//         parameters: {

//         },
//         responses: {
//             200: {
//                 description: "Success",
//                 type: "String",
//             }
//         },
//     })
//     async singleAdmin(req: Request, res: Response, next: NextFunction) {
//         try {
//             let adminId = res.locals.adminId,
//                 singleAdminData = await AdminV1.findOne<IAdmin.Admin>({ _id: adminId });

//             if (singleAdminData) {
//                 this.sendResponse(res, SUCCESS.DEFAULT, AdminV1.filterAdminData(singleAdminData));
//             } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).NOT_FOUND);
//         } catch (err) {
//             next(err);
//         }
//     }

//     /**
//      * @method patch
//      * @description updates the basic details of admin
//      * @author Desk Now Dev Team
//      */
//     @ApiOperationPatch({
//         description: "Admin update profile",
//         path: '/update',
//         parameters: {
//             body: {
//                 description: 'Body for admin reset password',
//                 required: true,
//                 model: 'ReqAdminUpdateProfile'
//             }
//         },
//         responses: {
//             200: {
//                 description: "Success",
//                 type: "String",
//             }
//         },
//     })
//     async updateAdmin(req: Request, res: Response, next: NextFunction) {
//         try {
//             let adminId = res.locals.adminId,
//                 payload = req.body,
//                 updatedAdmin = await AdminV1.updateEntity<IAdmin.Admin>(
//                     { _id: adminId }, payload
//                 );

//             if (updatedAdmin.data) {
//                 this.sendResponse(res, SUCCESS.DEFAULT, AdminV1.filterAdminData(updatedAdmin.data));
//             } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).NOT_FOUND);
//         } catch (err) {
//             next(err);
//         }
//     }

//     /**
//      * @method patch
//      * @description changes admin password
//      * @author Desk Now Dev Team
//      */
//     @ApiOperationPatch({
//         description: "User Verify Otp",
//         path: '/password',
//         parameters: {
//             body: {
//                 description: 'Body for admin reset password',
//                 required: true,
//                 model: 'ReqAdminChangePassword'
//             }

//         },
//         responses: {
//             200: {
//                 description: "Success",
//                 type: "String",
//             }
//         },
//     })
//     async changePassword(req: Request, res: Response, next: NextFunction) {
//         try {
//             let adminId = res.locals.adminId,
//                 payload = req.body,
//                 singleAdminData = await AdminV1.findOne<IAdmin.Admin>({ _id: adminId });

//             if (singleAdminData) {
//                 if (await AdminV1.verifyPassword(singleAdminData, payload.oldPassword)) {
//                     await AdminV1.updateEntity<IAdmin.Admin>(
//                         { _id: adminId },
//                         { password: Auth.hashData(payload.newPassword, singleAdminData.salt) },
//                     );
//                     this.sendResponse(res, SUCCESS.DEFAULT);
//                     Mailer.sendMail(FORMAT.EMAIL.ADMIN.PASSWORD_CHANGE(singleAdminData.email));
//                 } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).INCORRECT_OLD_PASSWORD);
//             } else this.sendResponse(res, RESPONSE.ADMIN(res.locals.lang).NOT_FOUND);
//         } catch (err) {
//             next(err);
//         }
//     }

//     /**
//      * @method patch
//      * @description logs out the admin from current session
//      * @author Desk Now Dev Team
//      */
//     @ApiOperationPatch({
//         description: "User Verify Otp",
//         path: '/logout',
//         parameters: {
//         },
//         responses: {
//             200: {
//                 description: "Success",
//                 type: "String",
//             }
//         },
//     })
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

// export const AdminController = new AdminClass();