/**
 * @name user.model
 * @description defines schema for user model 
 * @author Desk Now Dev Team
*/

import { Schema, model } from "mongoose";

import { ENUM, ENUM_ARRAY } from "../common";

// defines the single user schema 
const userSchema = new Schema(
    {
        name: { type: Schema.Types.String, },
        email: { type: Schema.Types.String },
        password: { type: Schema.Types.String },
        countryCode: { type: Schema.Types.String },
        phoneNo: { type: Schema.Types.String },
        otp: { type: Schema.Types.Number },
        otpExpiry: { type: Schema.Types.Date },
        status: { type: Schema.Types.String, enum: ENUM_ARRAY.USER.STATUS, default: ENUM.USER.STATUS.ACTIVE },
        userType: { type: Schema.Types.String, enum: ENUM_ARRAY.USER.TYPE, default: ENUM.USER.TYPE.BASIC },
        image: { type: Schema.Types.String, default: "" },
        city: { type: Schema.Types.String, default: "" },
        phoneVerified: { type: Schema.Types.Boolean, default: false },
        isDelete: { type: Schema.Types.Boolean, default: false },
        emailVerified: { type: Schema.Types.Boolean, default: false },
        resetToken: { type: Schema.Types.String },
        googleId: { type: Schema.Types.String },
        facebookId: { type: Schema.Types.String },
        lastSeen: { type: Schema.Types.Date },
        isOnline: { type: Schema.Types.Boolean, default: false }
    },
    {
        versionKey: false,
        collection: ENUM.COL.USER,
        timestamps: true
    }
);


export default model<IUser.User>(ENUM.COL.USER, userSchema);