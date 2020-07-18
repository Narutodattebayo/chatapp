/**
 * @name admin.model
 * @description defines schema for admin model 
 * @author Desk Now Dev Team
*/

import { Schema, model, SchemaTypes } from "mongoose";

import { ENUM } from "../common";

// admin meta data schema
const adminMetaSchema = {
    "lastLogin": { type: SchemaTypes.Date },
    "token": {
        "time": { type: SchemaTypes.Date },
        "value": { type: SchemaTypes.String, trim: true }
    }
}

// defines the single user schema 
const adminSchema = new Schema(
    {
        "adminMeta": adminMetaSchema,
        "email": { type: SchemaTypes.String, required: true, index: true },
        "isActive": { type: SchemaTypes.Boolean, default: true },
        "isDelete": { type: SchemaTypes.Boolean, default: false },
        "name": { type: SchemaTypes.String, trim: true },
        "password": { type: SchemaTypes.String },
        "profilePhoto": { type: SchemaTypes.String },
        "role": { type: SchemaTypes.String, default: ENUM.ADMIN.TYPE.SUPER_ADMIN },
        "salt": { type: SchemaTypes.String, required: true }
    },
    {
        versionKey: false,
        collection: ENUM.COL.ADMIN,
        timestamps: true
    }
);

export default model<IAdmin.Admin>(ENUM.COL.ADMIN, adminSchema);