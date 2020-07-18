/**
 * @file services/auth
 * @description defines authentication methods
 * @created 2019-07-25 22:37:38
 * @author Desk Now Dev Team
*/

import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { CONFIG } from '../common';

export const Auth = {

    /** generates a new JWT token */
    generateToken: function (payload: any): string {
        return jwt.sign(payload, CONFIG.JWT_PASSWORD, { algorithm: 'HS256' });
    },

    /** verifies the authenticity of the JWT token */
    verifyToken(token: string): IApp.Entity<any> {
        try{
            let payload = jwt.verify(token, CONFIG.JWT_PASSWORD, { algorithms: ['HS256'] });
            if (payload) {
                return { success: true, data: payload };
            } else return { success: false };
        }catch(err){
            return { success: false };
        }
        
    },

    /** generates JWT token for admin session id */
    generateAdminJWT: function (sessionId: string): string {
        return jwt.sign(
            {
                sessionId: sessionId,
                timestamp: Date.now()
            },
            CONFIG.JWT_PASSWORD,
            { algorithm: 'HS256' }
        );
    },

    /** generates JWT token for user session id */
    generateUserJWT: function (sessionId: string): string {
        return jwt.sign(
            {
                sessionId: sessionId,
                timestamp: Date.now()
            },
            CONFIG.JWT_PASSWORD,
            { algorithm: 'HS256' }
        );
    },

    /** generates hashed data string */
    hashData: function (data: string, salt: string): string {
        return crypto.createHmac('sha256', salt).update(data).digest('hex');
    },

    


}