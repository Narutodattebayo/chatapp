/**
 * @file user.v1.entity
 * @description defines v1 user entity methods
 * @created 2019-08-25 23:24:06
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import { ENUM } from "@common";
import BaseEntity from "../base.entity";
import ChatModel from "@models/chat.model";
//import HistoryModel from "@models/user.history.model"
import UserSessionModel from "@models/user_sessions.model";
import { Auth } from "../../services/auth.service"
import { CONSTANT } from "../../common/constant.common"

// import {Mailer} from "../../services/mailer.service"

class ChatEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }

    

    /**
     * creates a new user
     * @param payload - user data to insert
     */
    async saveNewMsg(payload: any) {
        let msg = await new this.model(payload).save();
        return msg.toObject()
    }







}

export const chatV1 = new ChatEntity(ChatModel);