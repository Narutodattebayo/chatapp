/**
 * @file routes/v1
 * @description exposes version 1 app route paths
 * @author Desk Now Dev Team
*/

import { Router } from "express";

import BaseRoute from "@baseRoute";
import UserRoute from "./user.routes";


class v1AppRoutes extends BaseRoute {

    public path = '/v1/user';

    constructor() {
        super();
        this.init();
    }

    get instance(): Router {
        return this.router;
    }

    /* defines middlewares for all the routes passing through */
    private routeMiddlewares() {
        this.router.use('/', (req, res, next) => {

            // prints the route endpoint on the console
            console.log(`\n========================= NEW REQUEST -> ${req.method} ${req.originalUrl}`);
            console.log(req.body);
            console.log(`\n=========================`);

            // sets the language for routes
            res.locals.lang = req.headers.lang || 'EN';

            next();
        });
    }

    /** initializes routes */
    private init() {
        this.routeMiddlewares();

        // routes go here

        this.router.use(UserRoute.path, UserRoute.instance);
      

    }
}

export default new v1AppRoutes();