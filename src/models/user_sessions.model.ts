/**
 * @file user_sessions.model
 * @description defines schema for user session model
 * @author Desk Now Dev Team
*/

import { Schema, model, SchemaTypes } from "mongoose";
import { ENUM, ENUM_ARRAY } from "../common";

const userSessionSchema = new Schema(
    {
        "userId": { type: SchemaTypes.ObjectId, required: true },
        "device": {
            "id": { type: SchemaTypes.String, trim: true },
            "name": { type: SchemaTypes.String, trim: true },
            "platform": {
                type: SchemaTypes.String,
                enum: ENUM_ARRAY.USER_SESSION.PLATFORM
            },
            "token": { type: SchemaTypes.String, trim: true },
            "version": { type: SchemaTypes.String, trim: true },
        },
        "isActive": { type: SchemaTypes.Boolean, default: true }
    },
    {
        versionKey: false,
        timestamps: true,
        collection: ENUM.COL.USER_SESSION
    }
);

export default model<IUser.UserSession>(ENUM.COL.USER_SESSION, userSessionSchema);