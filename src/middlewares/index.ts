/**
 * @file middlewares
 * @description exposes middleware functions
 * @author Desk Now Dev Team
*/

import { ErrorHandler, InvalidRoute } from "./handlers.middleware";
 import { VerifyAdminSession } from "./admin.middleware";
import { VerifyUserSession, VerifyUserSessionOptional, GetUserData,dateValidator } from "./user.middleware";

export default {
    ErrorHandler,
    InvalidRoute,
    GetUserData,
    VerifyUserSession,
    VerifyAdminSession,
    VerifyUserSessionOptional,
    dateValidator
}