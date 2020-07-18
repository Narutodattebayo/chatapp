/**
 * @file user.middleware
 * @description defines user authentication middleware functions
 * @author Desk Now Dev Team
*/

import { Types } from "mongoose";
import { Response, Request, NextFunction } from "express";

import { Auth } from "../services";
import User from "@models/user.model";
import UserSessionModel from "@models/user_sessions.model";
import { UserV1 } from "@entity";
import { ENUM } from "@common";

/** verify user session */
export const VerifyUserSession = async function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
        let authMethod = req.headers.authorization.split(" ")[0],
            authToken = req.headers.authorization.split(" ")[1];
        if (authMethod === 'Bearer' && authToken) {
            let decrypted = Auth.verifyToken(authToken);
            if (decrypted.success) {
                let sessionData = await UserSessionModel.findOne(
                    { _id: Types.ObjectId(decrypted.data.sessionId) }
                ).exec();
                if (sessionData && sessionData.isActive) {
                    let userdata: any = await UserV1.findOne({ _id: sessionData.userId });
                    if (!userdata) res.status(404).send({ success: false, statusCode: 404, message: 'User not found' })
                    else if (userdata.status == ENUM.USER.STATUS.ACTIVE) {
                        res.locals.userSessionId = sessionData._id;
                        res.locals.userId = sessionData.userId;
                        res.locals.userData = userdata
                        next();
                    } else {
                        UserSessionModel.updateMany({ _id: Types.ObjectId(decrypted.data.sessionId) }, { isActive: false })
                        res.status(403).send({ success: false, statusCode: 403, message: 'User is blocked by admin' });
                    }
                } else {
                    if (sessionData && !sessionData.isActive) res.status(440).send({ success: false, statusCode: 440, message: 'Session expired' });
                    else res.status(498).send({ success: false, statusCode: 498, message: 'Invalid Session' });
                }
            } else res.status(401).send('Invalid authorization token');
        } else res.status(400).send('Invalid authorization method');
    } else res.status(401).send('Authorization header missing');
}

/** verify user session */
export const VerifyUserSessionOptional = async function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
        let authMethod = req.headers.authorization.split(" ")[0],
            authToken = req.headers.authorization.split(" ")[1];
        if (authMethod === 'Bearer' && authToken) {
            let decrypted = Auth.verifyToken(authToken);
            if (decrypted.success) {
                let sessionData = await UserSessionModel.findOne(
                    { _id: Types.ObjectId(decrypted.data.sessionId) }
                ).exec();
                if (sessionData && sessionData.isActive) {
                    res.locals.userSessionId = sessionData._id;
                    res.locals.userId = sessionData.userId;
                    next();
                } else res.status(401).send({ success: false, statusCode: 201, message: 'Invalid Session or Session expired' });
            } else res.status(401).send('Invalid authorization token');
        } else res.status(400).send('Invalid authorization method');
    } else { next(); }
}

/** gets user data */
export const GetUserData = async function (req: Request, res: Response, next: NextFunction) {
    if (res.locals.userId) {
        let userData = await User.findOne({ _id: Types.ObjectId(res.locals.userId) }).exec();
        if (userData) {
            res.locals.userData = userData;
            next();
        } else res.status(400).send('User not found');
    } else res.status(400).send('Invalid user authorization');
}

export const dateValidator = async function (req: Request, res: Response, next: NextFunction) {
    var parsedstartDate = Date.parse(req.body.startDate);
    var parsedendDate = Date.parse(req.body.endDate)
    console.log(parsedstartDate, !isNaN(parsedstartDate))
    if (isNaN(parsedstartDate)) {
        res.status(400).send({ statusCode: 400, message: 'Please send valid Start Date' })
    }
    else if (isNaN(parsedendDate)) {
        res.status(400).send({ statusCode: 400, message: 'Please send valid End Date' })
    } else if (req.body.startDate < new Date()) {
        res.status(400).send({ statusCode: 400, message: 'Please send future Start Date' })
    } else if (req.body.endDate < new Date()) {
        res.status(400).send({ statusCode: 400, message: 'Please send future End Date' })
    } else if (req.body.endDate < req.body.startDate) {
        res.status(400).send({ statusCode: 400, message: '  End date cannot be smaller than Start Date' })
    } else {
        next()
    }

}