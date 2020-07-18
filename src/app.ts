/**
 * @file app
 * @description application start code
 * @created 2019-07-25 12:54:12
 * @author Desk Now Dev Team
*/

// resolves all the modules
import 'module-alias/register';

import cors from "cors";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";

import routes from "@routes";
import { CONFIG } from "@common";
import Middleware from "@middlewares";
import { mongoDOA } from "@services";
import * as swagger from "swagger-express-ts";
import "reflect-metadata";
import { SwaggerDefinitionConstant } from "swagger-express-ts";
import { bootstrapStatus } from "./services/bootstraps"
import * as swaggermodel from "./swaggermodels/"
export { swaggermodel };
import * as commonRoutes from "./routes/common.routes"
//import * as hbs from "hbs"
//import * as path from "path";

class Application {

    private app: express.Application;

    constructor() {
        this.app = express(); // initialize the express instance
        this.init();
    }

    /** gets the app instance */
    get instance(): express.Application {
        return this.app;
    }

    /** initializes app components */
    async init() {
        mongoDOA.connectDatabase(CONFIG.DB_URI); // connect to database
        bootstrapStatus.createAdmin; // initialize bootstrap functions

        this.useMiddlewares(); // use middlewares for requests
        this.useRoutes(); // use routing
    }

    /** uses the middlewares for the app */
    useMiddlewares() {
        this.app.use(cors()); // handles cross origin resouce sharing
        this.app.use(bodyParser.json()); // parses the incoming json requests
        this.app.use(bodyParser.urlencoded({ extended: false })); // parses the incoming query requests
        this.app.use(helmet()); // makes apps more secure
        this.app.set('views', express.static(process.cwd() + '/views'))
        console.log((process.cwd() + '/views'))
        this.app.set('view engine', 'hbs')
        this.app.use('/api-docs/swagger', express.static('swagger'));
        this.app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));

        this.app.use(express.static(process.cwd() + "/asset"));
        // this.app.use((req, res, next) => {
        //     res.sendFile(process.cwd() + '/src/index.html')
        // })
        this.app.use( (request, response, next) => {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.app.use(swagger.express(
            {
                definition: {
                    info: {
                        title: "Socket ",
                        version: "1.0",
                    },
                    securityDefinitions: {
                        apiKeyHeader: {
                            type: SwaggerDefinitionConstant.Security.Type.API_KEY,
                            in: SwaggerDefinitionConstant.Security.In.HEADER,
                            name: "Authorization"
                        }
                    }
                }
            }
        ));
    }

    /** uses the routes for the app */
    useRoutes() {
        this.app.use(commonRoutes.default.path, commonRoutes.default.instance)
        this.app.use(routes.path, routes.instance); // uses the in-app routing
        this.app.use(Middleware.InvalidRoute); // invalid route handler
        this.app.use(Middleware.ErrorHandler); // global error handler
    }
}

export default new Application();