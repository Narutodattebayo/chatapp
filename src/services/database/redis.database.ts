

import redis from 'redis';
import { CONFIG } from '@common';

class Redis {

    private client: redis.RedisClient;

    constructor() {
        let options: redis.ClientOpts = {};
        if (CONFIG.NODE_ENV !== "prod") options.db = 15;
        this.client = redis.createClient(options);
    }

    /**
     * sets the key into redis
     * @param key
     * @param value
     */
    async setKey(key: string, value: string) {
        return new Promise((res, rej) => {
            this.client.set(key, value, (err, reply) => {
                if (err) rej(err);
                else res(reply);
            });
        });
    }

    /**
     * gets the value of key from redis
     * @param key
     */
    async getFromKey(key: string): Promise<any> {
        return new Promise((res, rej) => {
            this.client.get(key, (err, reply) => {
                if (err) rej(err);
                else res(reply);
            });
        });
    }

    /**
     * deletes the key from redis
     * @param key
     */
    async deleteKey(key: string): Promise<any> {
        return new Promise((res, rej) => {
            this.client.del(key, (err, reply) => {
                if (err) rej(err);
                else res(reply);
            });
        });
    }

    /**
     * 
     */
    async getIndentity(key: string) {
        let updatedIndentity = (parseInt(await this.getFromKey(key)) + 1).toString()
        this.setKey(key, updatedIndentity);
        return updatedIndentity;
    }

   
   

    /**
     * user socket id set and get operations
     * @param op - type of operation `SET` | `GET`
     * @param userId - id of the user
     * @param socketId - id of the socket connection
    */
    async userSocketOp(op: 'SET' | 'GET' | 'DEL', userId: string, socketId?: string) {
        switch (op) {
            case 'SET': {
                if (socketId) this.setKey(`SOC_${userId}`, socketId);
                else throw Error('REDIS_ERR: No socketId specified in userSocketId - set operation');
                break;
            }
            case 'GET': return this.getFromKey(`SOC_${userId}`);
            case 'DEL': return this.deleteKey(`SOC_${userId}`);
        }
    }

    
}

export const redisDOA = new Redis();