import Socket from "socket.io"
import { Auth } from "../services/auth.service"
import { UserV1, chatV1, groupV1 } from "@entity"
import { RedisClass } from "../services"
import builders from "../builders"
import { Types } from "mongoose"
import { myGroups } from "builders/v1/user"


export class SocketClass {
    public static io: any
    private static instance: SocketClass
    constructor() {

    }


    static getSocket(server: any): SocketClass {

        // create new instance if not already exists
        if (typeof this.instance === "undefined") {
            this.io = Socket(server); // init socket server
            this.getInstance(); // init connection
            this.instance = new this(); // initialize instance with SocketIO object
        }
        return this.instance;
    }
    static getInstance() {
        this.io.on('connection', (socket: any, userId: any) => {
            if (socket.handshake.query.userId) {

                RedisClass.setSocketId(socket.handshake.query.userId, socket.id)
                this.updateUserOnlineStatus(socket.handshake.query.userId, true, new Date())
                this.sendDirectMessage(socket, this.io);
                this.ReceivedMessages(socket, this.io);
                this.Disconnected(socket, this.io);
                this.Reconnect(socket, this.io)
                this.getChatForAUser(socket, this.io)//for all chat messages between 2 users
                this.getAllChattedUsers(socket, this.io)//for all user list with a single message
                this.informStateChange(socket.handshake.query.userId, true)
                this.UserTyping(socket)
                this.deleteWholeChatWithUser(socket)
                // this.getAllDirectMessages(socket, this.io)
                //testing for group
                //this.joinMyGroups(socket, this.io)
                //this.sendGroupMessage(socket, this.io)
            }

        });
    }


    //........................................direct message handler..........................................................................
    static async sendDirectMessage(socket: any, io: any) {
        //take both userids from frontend and emit msg to the room(concated userids)
        //console.log(socket)

        socket.on('Direct_msg', async (data: any) => {
            console.log("DIRECT MESSAGE EVENT CALLED", data.receiverId)
            let room = ""
            let receiverSocket: any = await RedisClass.getSocketId(data.receiverId)
            let Ids = [];
            Ids.push(socket.handshake.query.userId)
            Ids.push(data.receiverId)
            Ids.sort((a, b) => { return a.localeCompare(b) })
            room += Ids[0] + Ids[1]
            chatV1.saveNewMsg({ sender: socket.handshake.query.userId, receiver: data.receiverId, message: data.msg, roomId: room, receivers: [socket.handshake.query.userId, data.receiverId] })
            if (receiverSocket) {
                io.sockets.connected[receiverSocket].join(room);
            }
            socket.join(room)
            io.to(room).emit('Direct_msg', { _id: socket.handshake.query.userId, sender: socket.handshake.query.userId, receiver: data.receiverId, name: data.name, msg: data.msg, time: new Date().toISOString() });
        })

    }


    //...................................receive message handler.............................................
    static async ReceivedMessages(socket: any, io: any) {
        socket.on('Message_Received_Successfully', (data: any) => {
            chatV1.editEntity({ createdAt: { $lte: data.lastMessageTime }, receivers: { $in: [socket.handshake.query.userId] } }, { $push: { receivedBy: socket.handshake.query.userId } })
        })
    }

    static async Disconnected(socket: any, io: any) {
        socket.on('disconnect', () => {
            RedisClass.removeSocketId(socket.handshake.query.userId);
            this.updateUserOnlineStatus(socket.handshake.query.userId, false, new Date())
            this.informStateChange(socket.handshake.query.userId, false, new Date().toISOString())
        })
        socket.on('disconnected', () => {
            RedisClass.removeSocketId(socket.handshake.query.userId)
            this.updateUserOnlineStatus(socket.handshake.query.userId, false, new Date())
            this.informStateChange(socket.handshake.query.userId, false, new Date().toISOString())
        })

    }

    static async Reconnect(socket: any, io: any) {
        socket.on('reconnect', () => {
            RedisClass.setSocketId(socket.handshake.query.userId, socket.id)
            this.updateUserOnlineStatus(socket.handshake.query.userId, true, new Date())
            this.informStateChange(socket.handshake.query.userId, true)
        })
    }



    //working fine
    // static async getMyGroups(userId: any) {
    //     let pipeline = builders.User.Chat.myGroups(Types.ObjectId(userId))
    //     let mygroups = await groupV1.basicAggregate(pipeline)
    //     console.log("mygroups...............", mygroups)
    //     return mygroups;
    // }

    // static async getAllMessages(socket: any, io: any) {
    //     //let receiverSocket: any = await RedisClass.getSocketId(socket.handshake.query.userId)
    //     let response = await this.getMyGroups(socket.handshake.query.userId)
    // }
    //send group msg...find group members

    //working fine
    // static async joinMyGroups(socket: any, io: any) {
    //     let mygroups: any = await this.getMyGroups(socket.handshake.query.userId)
    //     if (mygroups.length) {
    //         let groupIds = mygroups[0].ids
    //         socket.join(groupIds)//if error do by for loop
    //         RedisClass.addIdToRedisGroupCollection(groupIds, socket.id)
    //     }
    // }

    // static async sendGroupMessage(socket: any, io: any) {
    //     socket.on('testgroup', (data: any) => {
    //         io.to(socket.handshake.query.groupId).emit('group', data)
    //     })

    // }

    static async getAllDirectMessages(socket: any, io: any) {
        console.log("MESAGE LIST CALLED")
        let pipeline: any = builders.User.Chat.chatList(socket.handshake.query.userId)
        let response = await UserV1.basicAggregate(pipeline);
        socket.emit('MessageList', { data: response })
    }

    //chatted messages for a user

    static async getChatForAUser(socket: any, io: any) {
        socket.on('ourChatMessages', async (data: any) => {
            try {
                if (!data.page) {
                    data.page = 1;
                    data.limit = 5
                }
                let room = await this.getRoomId(data, socket)
                let pipeline: any = await builders.User.Chat.ourChatMessages(socket.handshake.query.userId, room, data.receiverId)
                let list: any = await chatV1.paginateAggregate(pipeline, { page: data.page, limit: data.limit, getCount: true })
                let user: any = await UserV1.findOne({ _id: data.receiverId })
                if (user.isOnline) {
                    list.isOnline = true
                } else {
                    list.lastSeen = user.lastSeen
                }
                socket.emit('ourChatMessages', list)
                RedisClass.addIdsToInformStateChange(data.receiverId, socket.handshake.query.userId)
            } catch (err) {
                socket.emit("error", err)
            }

        })

    }

    //all chats list
    static async getAllChattedUsers(socket: any, io: any) {

        socket.on('allchattedUsers', async (data: any) => {
            let pipeline: any = await builders.User.Chat.allChattedUsers(socket.handshake.query.userId)
            let list = await chatV1.paginateAggregate(pipeline, { page: data.page, limit: data.limit, getCount: true })
            socket.emit('allchattedUsers', list)
        })
    }

    static async getRoomId(data: any, socket: any) {
        let room = ""
        let Ids = [];
        Ids.push(socket.handshake.query.userId)
        Ids.push(data.receiverId)
        Ids.sort((a, b) => { return a.localeCompare(b) })
        room += Ids[0] + Ids[1]
        return room;
    }

    static async updateUserOnlineStatus(userId: any, status: any, time: any) {
        UserV1.updateDocument({ _id: userId }, { isOnline: status, lastSeen: time })
    }

    //inform the state change
    static async informStateChange(userId: any, status: any, lastSeen?: any) {
        console.log("INFORM STAET XHANGE CALLED")
        let usersToInform: any = await RedisClass.getIdsToInformStateChange(userId)
        if (usersToInform && usersToInform.length) {
            usersToInform.forEach(async (user: any) => {
                let socketId: any = await RedisClass.getSocketId(user)
                let dataToSend: any = {
                    userId: userId,
                    status: status,
                    lastSeen: lastSeen
                }
                this.io.to(socketId).emit('stateChange', dataToSend)
            });
        }

    }

    static async deleteWholeChatWithUser(socket: any) {
        let receiver
        socket.on("deleteWholeChat", (data: any) => {
            receiver = data.receiverId
            chatV1.editEntity({ type: "single", receivers: { $all: [Types.ObjectId(socket.handshake.query.userId), Types.ObjectId(data.receiverId)] } }, { $push: { deletedFor: socket.handshake.query.userId } }, { multi: true })
            socket.emit("deleteWholeChat", { success: true, _id: receiver })
        })


    }

    static async UserTyping(socket: any) {
        socket.on("typing", async (data: any) => {
            let receiverSocket: any = await RedisClass.getSocketId(data.receiverId)
            if (receiverSocket) {
                this.io.to(receiverSocket).emit("typing", { userId: socket.handshake.query.userId })
            }
        })
    }


}

export default new SocketClass()