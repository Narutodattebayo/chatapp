/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";

import { Auth } from "@services";
import BaseEntity from "../base.entity";
import AdminModel from "@models/admin.model";
import AdminSessionModel from "@models/admin_session.model";

class AdminEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    /**
     * creates a new admin
     * @param payload - admin data to insert
     */
    async createAdmin(payload: IAdmin.Request.CreateAdmin): Promise<IAdmin.Admin> {
        payload.password = Auth.hashData('Admin@123', payload.salt);
        let adminData = await new this.model(payload).save();
        return adminData.toObject();
    }

    /**
     * returns hashed password using the salt
     * @param adminData - the admin data
     * @param password - the password to match
     */
    async verifyPassword(adminData: IAdmin.Admin, password: string): Promise<boolean> {
        return adminData.password === Auth.hashData(password, adminData.salt);
    }


    /**
     * filters user data for safe response
     * @params adminData
     */
    filterAdminData(adminData: IAdmin.Admin): IAdmin.Admin {
        delete adminData.password; delete adminData.salt;
        return adminData;
    }

    /**
     * creates a new session for admin, removes previous session
     * @params payload - admin session data payload
     */
    async createNewSession(payload: any): Promise<IAdmin.AdminSession> {
        payload.adminId = Types.ObjectId(payload.adminId);
        // await this.removePreviousSession(payload.adminId, true);
        let sessionData = await new AdminSessionModel(payload).save();
        return sessionData.toObject();
    }

    /**
     * removes all previous session of admin
     * @params payload - admin session data payload
     */
    async removePreviousSession(id: Types.ObjectId, multi: Boolean): Promise<void> {
        if (multi) await AdminSessionModel.updateMany({ adminId: id, isActive: true }, { isActive: false });
        else await AdminSessionModel.updateOne({ _id: id }, { isActive: false });
    }
}

export const AdminV1 = new AdminEntity(AdminModel);