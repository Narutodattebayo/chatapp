export as namespace IAdmin;

import { Document } from "mongoose";

export interface Admin extends Document {
    adminMeta: {
        lastLogin: Date,
        token?: { time: Date, value: string }
    },
    email: string,
    isActive: boolean,
    isDelete: boolean,
    name: string,
    password?: string,
    profilePhoto?: string,
    role?: string,
    salt: string,
    createdAt: Date,
    updatedAt: Date
}

export interface AdminSession extends Document {
    deviceData?: { name?: string, platform?: string, version?: string },
    isActive: boolean,
    networkData?: { ipAddress?: string },
    adminId: Admin['_id'],
}

export namespace Request {
    export interface CreateAdmin {
        email: Admin['email'],
        name: Admin['name'],
        profilePhoto?: Admin['profilePhoto'],
        salt: Admin['salt'],
        password?: Admin['password']
    }
}