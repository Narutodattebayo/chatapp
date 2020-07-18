import redis from "redis"


class RedisSockets {
    private client: any
    private multiObject: any
    constructor() {
        this.client = redis.createClient({
          //  path: "redis-12272.c8.us-east-1-4.ec2.cloud.redislabs.com:12272",
            host:"redis-12272.c8.us-east-1-4.ec2.cloud.redislabs.com",
            port:12272,
            auth_pass:"Nad071d7wkWfmCDcAOA4txR1SbXvk8RZ"
            

        });
        this.multiObject = this.client.multi()
    }

    async setSocketId(userId: any, socketId: any) {
        this.client.set(userId, socketId, (err: any, result: any) => {
            if (err) console.log(err, "111111111111111111")
            console.log(result)
        })
        return;
    }
    async getSocketId(userId: any) {
        return new Promise((resolve, reject) => {
            console.log("getsocketid called")
            this.client.get(userId, (err: any, socket: any) => {
                if (err) {
                    console.log(err, 2222222222222222222222222222)
                } else {
                    console.log("?????????????????", socket)
                    resolve(socket)
                }
            })
        })


    }
    async removeSocketId(userId: any) {
        this.client.del(userId)
    }

    async addIdToRedisGroupCollection(groups: any, socketid: any) {
        // return new Promise((resolve, reject) => {
        //     groups.forEach((groupId: any) => {
        //         console.log("/????????????????", groupId, socketid)
        //         this.client.hmset(groupId.toString(), socketid)
        //     });

        // })
    }

    async addIdsToInformStateChange(receiverId: any, userId: any) {
        try {
            return new Promise((resolve, reject) => {
                console.log(receiverId, userId)


                this.client.sadd(JSON.stringify(receiverId), userId, (err: any, result: any) => {
                    if (err) {
                        console.log(err, "error in adding ...............")
                        reject(err)
                    } else {
                        console.log(result, "added successfully response")
                    }

                })





            })
        } catch (err) {
            console.log(err)
            return err
        }

    }

    async getIdsToInformStateChange(userId: any) {
        try {
            return new Promise((resolve, reject) => {
                this.client.smembers(JSON.stringify(userId), (err: any, result: any) => {
                    if (err) {
                        console.log(444444444444444444444444444444444444)
                        reject(err)
                    } else {
                        console.log(result, "response result")
                        resolve(result)
                    }
                })
            })
        } catch (err) {
            console.log(err)
            return err
        }

    }
}

export const RedisClass = new RedisSockets()