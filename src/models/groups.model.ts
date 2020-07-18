/**
 * @file user_sessions.model
 * @description defines schema for user session model
 * @author Desk Now Dev Team
*/

import { Schema, model, SchemaTypes } from "mongoose";
import { ENUM, ENUM_ARRAY } from "../common";

const groupSchema = new Schema(
    {
        name: { type: SchemaTypes.String, required: true },  
        admins: { type: [SchemaTypes.ObjectId] },
        members: { type: [SchemaTypes.ObjectId] },
        creator: { type: SchemaTypes.ObjectId },
        icon: { type: SchemaTypes.String },
        
    },
    {
        versionKey: false,
        timestamps: true,
        collection: ENUM.COL.GROUP
    }
);

export default model(ENUM.COL.GROUP, groupSchema);