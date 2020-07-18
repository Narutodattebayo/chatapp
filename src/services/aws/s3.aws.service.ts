/**
 * @file s3.aws.service
 * @description defines AWS S3 methods
 * @author Desk Now Dev Team
*/

import mimeType from "mime-types";
import AWS_S3 from "aws-sdk/clients/s3";

import { CONFIG, BASE } from "@common";

class S3ServiceClass {

    private s3: AWS_S3;
    private bucket: string;
    private basePath: string;

    constructor(basePath: string) {
        this.bucket = CONFIG.AWS.BUCKET;
        this.basePath = basePath;
        this.s3 = new AWS_S3({
            accessKeyId: CONFIG.AWS.ACCESS_KEY,
            secretAccessKey: CONFIG.AWS.SECRET_KEY
        });
    }

    /**
     * uploads data to S3 bucket
     * @param name - name of the file
     * @param data - file data object
     */
    async upload(name: string, data: any) {
        let contentType = mimeType.lookup(name); // check for correct content type
        if (!contentType) throw Error('Invalid content Type');

        return this.s3.upload({
            Key: `${this.basePath}${name}`,
            Body: data,
            ContentType: contentType,
            Bucket: this.bucket,
            ACL: 'public-read'
        }).promise();
    }
}

export const S3_Image = new S3ServiceClass(BASE.AWS.IMAGE_PATH);
export const S3_ARModel = new S3ServiceClass(BASE.AWS.AR_MODEL_PATH);
