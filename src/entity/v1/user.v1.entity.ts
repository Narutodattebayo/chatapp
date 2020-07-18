/**
 * @file user.v1.entity
 * @description defines v1 user entity methods
 * @created 2019-08-25 23:24:06
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import { ENUM } from "@common";
import BaseEntity from "../base.entity";
import UserModel from "@models/user.model";
//import HistoryModel from "@models/user.history.model"
import UserSessionModel from "@models/user_sessions.model";
import { Auth } from "../../services/auth.service"
import { CONSTANT } from "../../common/constant.common"

// import {Mailer} from "../../services/mailer.service"

class UserEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    /**
     * creates a new user
     * @param payload - user data to insert
     */
    async createUser(payload: any) {
        payload.password = Auth.hashData(payload.password, CONSTANT.PASSWORD_HASH_SALT)
        let userData = await new this.model(payload).save();
        return userData.toObject();
    }

    /**
     * creates a new user
     * @param payload - user data to insert
     */
    async createUserNew(payload: IUser.Request.CreateUser): Promise<IUser.User> {
        let adminData = await new this.model(payload).save();
        return adminData.toObject();
    }


    /**
     * filters user data for safe response
     * @params userData
     */
    filterUserData(userData: IUser.User): IUser.User {
        return userData;
    }

    /**
     * creates a new session for user, removes previous session
     * @params payload - user session data payload
     * @todo-action uncomment remove previous sessions for single login
     */
    async createNewSession(payload: any): Promise<IUser.UserSession> {
        payload.userId = Types.ObjectId(payload.userId);
        //this is for testing only else it will be single sessionm app
        await this.removePreviousSession(payload.userId, true);
        let sessionData = await new UserSessionModel(payload).save();
        return sessionData.toObject();
    }

    /**
     * removes all previous session of user
     * @params payload - user session data payload
     */
    async removePreviousSession(id: Types.ObjectId, multi: Boolean): Promise<void> {
        if (multi) await UserSessionModel.updateMany({ userId: id, isActive: true }, { isActive: false });
        else await UserSessionModel.updateOne({ _id: id }, { isActive: false });
    }

    /**
     * removes all previous session of user
     * @params payload - user session data payload
     */
    async removeSession(id: Types.ObjectId): Promise<void> {
        await UserSessionModel.updateMany({ _id: id }, { isActive: false });
    }

    /**
     * blocks the user
     * @param userId
     * @param actionDir `true` to block, `false` to unblock
    */
    async blockUser(userId: IUser.User['_id'], actionDir: boolean) {
        userId = Types.ObjectId(userId);
        let updatedUser = await this.updateEntity<IUser.User>(
            { _id: userId },
            {
                isActive: !actionDir,
                status: actionDir ? ENUM.USER.STATUS.BLOCK : ENUM.USER.STATUS.ACTIVE
            }
        );
        if (updatedUser.data) {
            if (actionDir) await this.removePreviousSession(userId, true);
            return { success: true };
        }
        else return { success: false }
    }

    /**
     * get user device token
     * @param userId - user to get device token
    */
    // async getUserToken(userId: IUser.User['_id']) {
    //     let userData = await this.findOne<IUser.User>({ _id: userId });
    //     if (userData) return userData.device.token;
    //     else throw Error('USER_ERR: No user to get their device token');
    // }

    /**
     * get all user device tokens
     */
    async getAllUserTokens(payload: any) {
        let matchCondition: any = { 'device.token': { $exists: true, $ne: '' }, isDelete: false };
        if (payload.usersList) matchCondition['_id'] = { $in: payload.usersList };
        let userData = await this.basicAggregate(
            [
                { $match: matchCondition },
                { $group: { _id: null, tokens: { $push: '$device.token' } } }
            ]
        );
        if (userData.length) return userData[0].tokens;
        else return [];
    }


    async checkUserAlreadyExists(payload: any) {
        let conditions = [];
        if (payload.resetToken && payload.resetToken != '') conditions.push({ resetToken: payload.resetToken })
        if (payload.email && payload.email != '') conditions.push({ email: payload.email });
        if (payload.phoneNo && payload.phoneNo != '' && payload.countryCode && payload.countryCode != '') conditions.push(
            { phoneNo: payload.phoneNo, countryCode: payload.countryCode }
        );
        if (payload.userId) conditions.push({ _id: payload.userId })
        if (conditions.length) {
            let userData = await this.basicAggregate(
                [
                    {
                        $match: {
                            isDelete: false,
                            $or: conditions,
                        }
                    }
                ]
            )
            return userData
        }
        return [];


    }

    async checkSocialIdExists(payload: any) {
        let conditions = [];
        if (payload.socialType == ENUM.LOGIN_TYPE.FACEBOOK) conditions.push({ facebookId: payload.socialId });
        if (payload.socialType == ENUM.LOGIN_TYPE.GOOGLE) conditions.push({ googleId: payload.socialId });
        if (payload.socialType == ENUM.LOGIN_TYPE.APPLE) conditions.push({ appleId: payload.socialId });
        let userData = await this.basicAggregate(
            [
                {
                    $match: {
                        isDelete: false,
                        $or: conditions
                    }
                }
            ]
        )
        return userData
    }


    async createUserFromSocialId(payload: any) {
        let dataToSave: any = {
            name: payload.name
        };
        if (payload.email && payload.email != '') {
            dataToSave.email = payload.email,
                dataToSave.emailVerified = true
        };
        if (payload.countryCode && payload.countryCode != '' && payload.phoneNo && payload.phoneNo != '') {
            dataToSave.countryCode = payload.countryCode,
                dataToSave.phoneVerified = true
        };
        if (payload.phoneNo) dataToSave.phoneNo = payload.phoneNo;
        if (payload.socialType == ENUM.LOGIN_TYPE.FACEBOOK) dataToSave.facebookId = payload.socialId;
        if (payload.socialType == ENUM.LOGIN_TYPE.APPLE) dataToSave.appleId = payload.socialId;
        if (payload.socialType == ENUM.LOGIN_TYPE.GOOGLE) dataToSave.googleId = payload.socialId;
        let userData = await new this.model(dataToSave).save();
        return userData.toObject();

    }

    async verifyUser(userId: IUser.User['_id']) {
        let update = {
            emailVerified: true,
            otp: null
        }
        return await this.updateDocument({ _id: userId }, update)
    }


    async mergeUserAccount(payload: any, userData: IUser.User) {
        try {
            let dataToUpdate: any = {}
            if (payload.platform == ENUM.LOGIN_TYPE.FACEBOOK) dataToUpdate = { facebookId: payload.data.facebookId };
            if (payload.platform == ENUM.LOGIN_TYPE.GOOGLE) dataToUpdate = { googleId: payload.data.googleId };
            if (payload.platform == ENUM.LOGIN_TYPE.GOOGLE) dataToUpdate = { googleId: payload.data.appleId };
            return await this.updateDocument({ _id: userData._id }, dataToUpdate);
        } catch (error) {
            console.log(error)
        }

    }

    removeUnnecessaryData(data: any) {
        delete (data.password);
        delete (data.otp);
        delete (data.otpExpiry);
        delete (data.resetToken);
        return data;
    }







}

export const UserV1 = new UserEntity(UserModel);