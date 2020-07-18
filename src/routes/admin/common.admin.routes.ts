// /**
//  * @file common.admin.routes
//  * @description defines routing for admin common routes
//  * @author Desk Now Dev Team
// */

// import { celebrate } from "celebrate";
// import { Request, Response, NextFunction, Router } from "express";

// import BaseRoute from "@baseRoute";
// import { VALIDATION } from "@common";
// import { AdminCommonController } from "../../controllers/admin";

// class CommonRouteClass extends BaseRoute {

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

//         /** admin login */
//         this.router.post('/login',
//             celebrate({
//                 body: {
//                     email: VALIDATION.ADMIN.EMAIL.required(),
//                     password: VALIDATION.ADMIN.PASSWORD.required()
//                 }
//             }),
//             (req: Request, res: Response, next: NextFunction) => {
//                 AdminCommonController.adminLogin(req, res, next);
//             }
//         );

//         /** forgot password */
//         this.router.post('/password/forgot',
//             celebrate({ body: { email: VALIDATION.ADMIN.EMAIL.required() } }),
//             (req: Request, res: Response, next: NextFunction) => {
//                 AdminCommonController.forgotPassword(req, res, next);
//             }
//         );

//         /** verify password */
//         this.router.get('/password/verify/:metaToken',
//             celebrate({
//                 params: { metaToken: VALIDATION.ADMIN.META_TOKEN.required() },
//                 query: { email: VALIDATION.ADMIN.EMAIL }
//             }),
//             (req: Request, res: Response, next: NextFunction) => {
//                 AdminCommonController.verifyMetaToken(req, res, next);
//             }
//         );

//         /** admin login */
//         this.router.post('/password/reset/:metaToken',
//             celebrate({
//                 params: { metaToken: VALIDATION.ADMIN.META_TOKEN.required() },
//                 body: { password: VALIDATION.ADMIN.PASSWORD.required() }
//             }),
//             (req: Request, res: Response, next: NextFunction) => {
//                 AdminCommonController.resetPassword(req, res, next);
//             }
//         );

      
//     }
// }

// export default new CommonRouteClass('/');