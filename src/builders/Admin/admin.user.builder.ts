
import { Projections } from "./index"
import { Types } from "mongoose";
import builders from "@builders";
/**
 * @file user.v1.builder
 * @description defines v1 user builder objects
 * @created 2019-09-16 16:09:56
 * @author Desk Now Dev Team
*/



/**
 * gets the list of users
 * @param payload - the query data
 */
export const UserList = (payload: any) => {
    let pipeline: any = [];
    let matchconditions = [];
    let filterConditions: any = [];
    if (payload.search) {
        matchconditions.push(
            { name: { $regex: payload.search, $options: "si" } },
            { email: { $regex: payload.search, $options: "si" } },
            { phoneNo: { $regex: payload.search, $options: "si" } }
        );
    }
    if (payload.status && payload.status != "") {
        let statuses = payload.status.split(',')
        if (statuses.indexOf('active') != -1) {
            filterConditions.push({ status: "active" })
        }
        if (statuses.indexOf('block') != -1) {
            filterConditions.push({ status: "block" })
        }
        if (statuses.indexOf('elite') != -1) {
            filterConditions.push({ userType: "elite" })
        }
        if (statuses.indexOf('basic') != -1) {
            filterConditions.push({ userType: "basic" })
        }
    }
    pipeline.push({ $match: { isDelete: false } })
    if (matchconditions.length) pipeline.push({ $match: { $or: matchconditions } })
    if (filterConditions.length) pipeline.push({ $match: { $and: filterConditions } })
    if (payload.sortKey) {
        if (payload.sortKey == "name") pipeline.push({ $sort: { name: 1 } })
        if (payload.sortKey == "createdAt") pipeline.push({ $sort: { createdAt: -1 } })
    } else pipeline.push({ $sort: { createdAt: -1 } })
    pipeline.push({
        $lookup: {
            from: "cars",
            let: { user: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ['$userId', '$$user'] }, isDelete: false } }
            ],
            as: "userCars"
        }
    })
    pipeline.push({
        $lookup: {
            from: "events",
            let: { user: "$_id" },
            pipeline: [{
                $match: {
                    $expr: { $eq: ['$createdBy', '$$user'] }, isDelete: false, isPublished: true
                }
            }
            ],
            as: "eventsCreated"
        }
    })

    pipeline.push({ $project: Projections.AdminUserList.userDetails })

    return pipeline;
}

/**
 * checks if email and phone already exists fo a user
 * @param payload - the query data
 */

export const checkExistingUser = (payload: any, userId: any) => {
    let pipeline = [];
    let conditions: any = [];
    pipeline.push({ $match: { _id: { $ne: Types.ObjectId(userId) }, isDelete: false } })
    if (payload.email) {
        conditions.push({ email: payload.email })
    }
    if (payload.countryCode && payload.countryCode != "" && payload.phoneNo && payload.phoneNo != "") {
        conditions.push({ countryCode: payload.countryCode, phoneNo: payload.phoneNo })
    }
    pipeline.push({ $match: { $or: conditions } });
    return pipeline;
}


export const userCarList = (userId: any) => {
    let pipeline = [];
    pipeline.push({ $match: { userId: Types.ObjectId(userId), isDelete: false } })
    return pipeline;
}

export const carDetails = (carId: any) => {
    let pipeline = [];
    pipeline.push({ $match: { userId: Types.ObjectId(carId), isDelete: false } })
    return pipeline;
}


export const UserDetails = (userId: any) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: Types.ObjectId(userId) } });
    pipeline.push({
        $lookup: {
            from: "cars",
            let: { user: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ['$userId', '$$user'] }, isDelete: false } }
            ],
            as: "userCars"
        }
    })
    pipeline.push({ $project: builders.Admin.Projections.AdminUserList.AdminuserDetails })
    return pipeline
}





