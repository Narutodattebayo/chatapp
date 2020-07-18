// /**
//  * @file admin.routes
//  * @description defines routing for admin routes
//  * @author Appinveniv
// */

// import { celebrate } from "celebrate";
// import { Request, Response, NextFunction, Router } from "express";

// import BaseRoute from "@baseRoute";
// import { VALIDATION } from "@common";
// import Middleware from "@middlewares";
// import { AdminController } from "../../controllers/admin/admin.controller";

// class AdminRouteClass extends BaseRoute {

//     public path: string;

//     constructor(path: string) {
//         super();
//         this.path = path;
//         this.initRoutes();
//     }

//     get instance(): Router {
//         return this.router;
//     }

//     initRoutes() {

//         /** changes admin password */
//         this.router.patch('/password',
//             celebrate({
//                 body: {
//                     oldPassword: VALIDATION.ADMIN.PASSWORD.required(),
//                     newPassword: VALIDATION.ADMIN.PASSWORD.required()
//                 }
//             }),
//              Middleware.VerifyAdminSession,
//             (req: Request, res: Response, next: NextFunction) => {
//                 AdminController.changePassword(req, res, next);
//             }
//         );

//         /** updates the user data */
//         this.router.patch('/update',
//             celebrate({
//                 body: {
//                     profilePhoto: VALIDATION.ADMIN.PROFILE_PHOTO,
//                     name: VALIDATION.ADMIN.NAME
//                 }
//             }),
//              Middleware.VerifyAdminSession,
//             (req: Request, res: Response, next: NextFunction) => {
//                 AdminController.updateAdmin(req, res, next);
//             }
//         );

//         /** gets the detail of single admin */
//         this.router.get('/details',
//              Middleware.VerifyAdminSession,
//             (req: Request, res: Response, next: NextFunction) => {
//                 AdminController.singleAdmin(req, res, next);
//             }
//         );

//         /** logs out the admin of current session */
//         this.router.patch('/logout',
//              Middleware.VerifyAdminSession,
//             (req: Request, res: Response, next: NextFunction) => {
//                 AdminController.adminLogout(req, res, next);
//             }
//         );
//     }
// }

// export default new AdminRouteClass('/');