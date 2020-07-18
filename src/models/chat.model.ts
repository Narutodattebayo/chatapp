/**
 * @file user_sessions.model
 * @description defines schema for user session model
 * @author Desk Now Dev Team
*/

import { Schema, model, SchemaTypes } from "mongoose";
import { ENUM } from "../common";

const chatSchema = new Schema(
    {
        type: { type: SchemaTypes.String, required: true, default: 'single' },  //single/group
        groupId: { type: SchemaTypes.ObjectId },  //empty in case of type >>>single 
        sender: { type: SchemaTypes.ObjectId, required: true },
        receiver: { type: SchemaTypes.ObjectId },//only in case of single
        receivers: { type: [SchemaTypes.ObjectId], required: true },//only in case of group
        message: { type: SchemaTypes.String, required: true },
        receivedBy: { type: [SchemaTypes.ObjectId], default: [] },
        seenBy: { type: [SchemaTypes.ObjectId], default: [] },
        roomId: { type: SchemaTypes.String },
        deletedFor: { type: [SchemaTypes.ObjectId], default: [] },
        isDelete: { type: SchemaTypes.Boolean, default: false }
    },
    {
        versionKey: false,
        timestamps: true,
        collection: ENUM.COL.CHAT
    }
);

export default model(ENUM.COL.CHAT, chatSchema);