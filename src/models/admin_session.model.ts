/**
 * @file admin_session.model
 * @description defines schema for admin session model
 * @author Desk Now Dev Team
*/

import { Schema, model, SchemaTypes } from "mongoose";
import { ENUM } from "../common";

const adminSessionSchema = new Schema(
    {
        adminId: { type: SchemaTypes.ObjectId, required: true, index: true },
        deviceData: {
            platform: { type: SchemaTypes.String, default: ENUM.ADMIN.DEVICE_PLATFORM.WEB },
            name: { type: SchemaTypes.String, trim: true },
            version: { type: SchemaTypes.String, trim: true }
        },
        isActive: { type: SchemaTypes.Boolean, default: true },
        networkData: {
            ipAddress: { type: SchemaTypes.String }
        }
    },
    {
        versionKey: false,
        timestamps: true,
        collection: ENUM.COL.ADMIN_SESSION
    }
);

export default model<IAdmin.AdminSession>(ENUM.COL.ADMIN_SESSION, adminSessionSchema);