/**
 * @file s3.aws.service
 * @description defines AWS S3 methods
 * @author Desk Now Dev Team
*/

import { SNS } from "aws-sdk";

import { CONFIG } from "@common";

class SnsServiceClass {


    private sns: SNS

    constructor() {

        this.sns = new SNS({
            accessKeyId: CONFIG.SNS.ACCESS_KEY,
            secretAccessKey: CONFIG.SNS.SECRET_KEY
        })
    }




    async sendSms(phone: string,OTP:number) {
        this.sns.publish({
            Message: `Your OTP Is ${OTP}` ,
            Subject: "REV Signup",
            PhoneNumber: phone
        }, (err, data) => {
            if (err) console.log(err)
            console.log(data)

        })
    }
}

export const SnsService = new SnsServiceClass();

