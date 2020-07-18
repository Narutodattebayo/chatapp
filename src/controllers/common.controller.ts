

import { Request, Response, NextFunction } from "express";
import { ApiPath, } from "swagger-express-ts";
import BaseClass from "@baseController";
import { TEMPLATER } from "../htmlHelper";
import { CONSTANT } from "../common/constant.common"

@ApiPath({
    path: "/",
    name: "Common",
    security: { apiKeyHeader: [] },
})
class CommonClass extends BaseClass {

    constructor() {
        super();
    }

    async deeplinkingEventShare(req: Request, res: Response, next: NextFunction) {
        try {
            let eventId: any = req.params.eventId;
            let url = CONSTANT.ANDROID_LINK + `?viewId=1&eventId=${eventId}`
            let ios_store_link = CONSTANT.IOS_STORE_LINK + `?viewId=1&eventId=${eventId}`
            let iosLink = CONSTANT.IOS_LINK + `?viewId=1&eventId=${eventId}`
            let obj = {
                fallback: CONSTANT.FALLBACK,
                url: url,
                android_package_name: CONSTANT.ANDROID_PACKAGE_NAME,
                ios_store_link: ios_store_link,
                iosLink: iosLink
            };
            let html: any = await TEMPLATER.makeHtmlTemplate(`${CONSTANT.EMAIL_TEMPLATES}/staticpage.html`, obj);
            console.log()
            return this.sendhtml(res, html)

        } catch (err) {
            next(err);
        }
    }




}

export const CommonController = new CommonClass();