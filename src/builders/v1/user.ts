
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
export const PendingMessages = (userId: any) => {
    let pipeline: any = [];
    pipeline.push({ $match: { receiver: Types.ObjectId(userId), isReceived: false } })
    pipeline.push({
        $group: {
            _id: "$sender",
            messages: { $push: "$$ROOT" }
        }
    })
    return pipeline
}

export const userList = (userId: any, payload: any) => {
    let pipeline: any = [];
    pipeline.push({ $match: { isDelete: false, emailVerified: true, _id: { $ne: Types.ObjectId(userId) } } })
    if (payload.search) {
        pipeline.push({ $match: { name: { $regex: payload.search, $options: 'i' } } })
    }
    pipeline.push({
        $project: {
            name: 1,
            email: 1
        }
    })
    return pipeline
}


export const chatList = (userId: any) => {
    let pipeline: any = [];
    pipeline.push({ $match: { receivers: { $in: [Types.ObjectId(userId)] } } })
    pipeline.push({
        $project: {
            sender: 1,
            message: 1,
            createdAt: 1
        }
    })
    pipeline.push({ $sort: { createdAt: -1 } })
    pipeline.push({
        $group: {
            _id: '$roomId',
            messages: { $push: '$$ROOT' }
        }
    })

    return pipeline
}

export const myGroups = (userId: any) => {
    let pipeline = [];
    pipeline.push({ $match: { members: { $in: [userId] } } })
    pipeline.push({ $project: { name: 1 } })
    pipeline.push({
        $group: {
            _id: null,
            ids: { $push: '$_id' }
        }
    })
    return pipeline;

}

export const ourChatMessages = (userId: any, roomId: any, receiver: any) => {
    let pipeline = [];
    pipeline.push({
        $match: { roomId: roomId, deletedFor: { $nin: [Types.ObjectId(userId)] } }
    })
    pipeline.push({ $sort: { createdAt: -1 } })
    pipeline.push({
        $project: {
            sender: 1,
            receiver: receiver,
            msg: '$message',
            time: '$createdAt',
            isSender: { $cond: { if: { $eq: ['$sender', userId] }, then: true, else: false } }
        }
    })
    return pipeline
}

export const allChattedUsers = (userId: any) => {
    let pipeline = [];
    pipeline.push({ $match: { deletedFor: { $nin: [Types.ObjectId(userId)] }, receivers: { $in: [Types.ObjectId(userId)] } } })
    pipeline.push({ $sort: { createdAt: -1 } })
    pipeline.push({
        $group: {
            _id: '$roomId',
            data: { $push: "$$ROOT" }
        }
    })
    pipeline.push({
        $addFields: {
            notSeen: {
                $filter: {
                    input: "$data",
                    as: "all",
                    cond: { $not: { $setIsSubset: [[Types.ObjectId(userId)], "$$all.seenBy"] } }
                }
            }
        }
    })
    pipeline.push({
        $project: {
            count: { $size: "$notSeen" },
            lastMessage: { $slice: ["$data", 1] },
            person: 1
        }
    })
    pipeline.push({ $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } });
    pipeline.push({
        $addFields: {
            chattedPerson: {
                $cond:
                    { if: { $eq: ["$lastMessage.sender", Types.ObjectId(userId)] }, then: "$lastMessage.receiver", else: "$lastMessage.sender" }
            }
        }
    })
    pipeline.push(
        {
            $lookup: {
                from: "users",
                let: { person: "$chattedPerson" },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$person'] } } },
                    { $project: { name: 1, email: 1 } }
                ],
                as: "user"
            }
        }
    )
    pipeline.push({ $unwind: { path: "$user", preserveNullAndEmptyArrays: true } })
    pipeline.push({
        $project: {
            unreadCount: "$count",
            messageType: "$lastMessage.type",
            msg: '$lastMessage.message',
            time: '$lastMessage.createdAt',
            receiver: "$lastMessage.receiver",
            sender: "$lastMessage.sender",
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email"

        }
    })
    pipeline.push({ $sort: { time: -1 } })
    return pipeline

}
