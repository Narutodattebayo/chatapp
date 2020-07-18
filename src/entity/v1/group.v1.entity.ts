/**
 * @file user.v1.entity
 * @description defines v1 user entity methods
 * @created 2019-08-25 23:24:06
 * @author Desk Now Dev Team
*/

import { Model, Types } from "mongoose";
import { ENUM } from "@common";
import BaseEntity from "../base.entity";
import GroupModel from "@models/groups.model";


// import {Mailer} from "../../services/mailer.service"

class GroupEntity extends BaseEntity {

    constructor(model: Model<any>) {
        super(model);
    }



    /**
     * creates a new user
     * @param payload - user data to insert
     */
    async createGroup(payload: any) {
        let group = await new this.model(payload).save();
        return group.toObject()
    }







}

export const groupV1 = new GroupEntity(GroupModel);