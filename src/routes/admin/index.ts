// /**
//  * @file routes/admin
//  * @description exposes admin routing paths
//  * @created 2019-07-30 00:27:29
//  * @author Desk Now Dev Team
// */

// import { Router } from "express";

// import BaseRoute from "@baseRoute";
// import CommonRoute from "./common.admin.routes";
// import AdminRoute from "./admin.routes"
// class AdminRoutes extends BaseRoute {

//     public path = '/admins';

//     constructor() {
//         super();
//         this.init();
//     }

//     get instance(): Router {
//         return this.router;
//     }

//     /* defines middlewares for all the routes passing through */
//     private routeMiddlewares() {
//         this.router.use('/', (req, res, next) => {
//             console.log("testing...........",req.body,req.query)
//             // prints the route endpoint on the console
//             console.log(`\n========================= NEW REQUEST -> ${req.method} ${req.originalUrl}`);
//             console.log(req.body);
//             console.log(`\n=========================`);

//             // sets the language for routes
//             res.locals.lang = 'EN';

//             next();
//         });
//     }

//     /** initializes routes */
//     private init() {
//         this.routeMiddlewares();
//         this.router.use(CommonRoute.path, CommonRoute.instance);
//         this.router.use(AdminRoute.path, AdminRoute.instance);
      
//     }
// }

// export default new AdminRoutes();