/**
 * @file handler.middleware
 * @description defines handler middleware functions
 * @author Desk Now Dev Team
*/

import { isCelebrate } from "celebrate";
import { Response, Request, NextFunction } from "express";

/** handles node process errors */
export const ErrorHandler = function (err: any, req: Request, res: Response, next: NextFunction) {

    if (isCelebrate(err)) {
        let messagetosend = err.joi.details[0].message.replace(/"/g, '')
        messagetosend = messagetosend[0].toUpperCase() + messagetosend.slice(1);
        return res.status(400).send({
            success: false,
            statusCode: 400,
            key: err.joi.details[0].context.key,
            message: messagetosend
        });
    } else if (err.expose) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode
        });
    } else {
        console.log('ERROR -> ', err);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
}

/** handles invalid route message */
export const InvalidRoute = (req: Request, res: Response, next: NextFunction) => {
    // console.log("invalid route",req.body,req.query,req)
    res.status(404).json({
        success: false,
        message: 'Invalid route',
        statusCode: 404
    });
}