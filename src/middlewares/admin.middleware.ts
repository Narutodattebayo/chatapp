/**
 * @file auth.middleware
 * @description defines authentication middleware functions
 * @author Desk Now Dev Team
*/

import { Types } from "mongoose";
import { Response, Request, NextFunction } from "express";

//import { AdminV1 } from "@entity";
import { Auth } from "../services";
import AdminSessionModel from "@models/admin_session.model";

/** verify session */
export const VerifyAdminSession = async function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
        let authMethod = req.headers.authorization.split(" ")[0],
            authToken = req.headers.authorization.split(" ")[1];
        if (authMethod === 'Bearer' && authToken) {
            let decrypted = Auth.verifyToken(authToken);
            if (decrypted.success) {
                let sessionData = await AdminSessionModel.findOne(
                    { _id: Types.ObjectId(decrypted.data.sessionId) }
                ).exec();
                if (sessionData && sessionData.isActive) {
                    res.locals.adminSessionId = sessionData._id;
                    res.locals.adminId = sessionData.adminId;
                    next();
                } else res.status(401).send({ success: false, statusCode: 401, message: 'Invalid Session or Session expired' });
            } else res.status(401).send('Invalid authorization token');
        } else res.status(400).send('Invalid authorization method');
    } else res.status(401).send('Authorization header missing');
}

