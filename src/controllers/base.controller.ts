

import { Response } from "express";

export default class BaseClass {

    constructor() { }

    /** dispatches response from the server */
    async sendResponse(r: Response, b: IApp.Dispatcher, d: IApp.DataKeys = {}) {
        b.data = d;
        r.status(b.httpCode).json(b);
    }

    /** sends error response after printing on console */
    async errorResponse(res: Response, err: any) {
        console.log("ERROR : ", err);
        res.status(400).send({ success: false, message: err.message || err, statusCode: 400 });
    }

    async sendhtml(response: Response,html:any){
        response.writeHead(200, { 'Content-Type': 'text/html' });
        return response.end(html, 'utf-8');

    }
}