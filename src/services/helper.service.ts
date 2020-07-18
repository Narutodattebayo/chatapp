/**
 * @name helper.service
 * @description defines helper functions
 * @created 2019-07-04 00:01:46
 * @author Desk Now Dev Team
*/

import fs from "fs";
import request from "request";
import crypto from 'crypto';
import uuid from "uuid/v1";

export const Helper = {

    /** converts the sort type to mongoose sort object */
    convertSortType: function (sortType: string) {
        return sortType === 'asc' ? 1 : -1;
    },

    generateMetaToken: function () {
        return { time: new Date(Date.now() + 3600000), value: uuid() };
    },

    /**
     * generates lookup object
     * @params from, localField, foreignField, as
     */
    lookupGenerator: function (from: string, localField: string, foreignField: string, as: string) {
        return { from, localField, foreignField, as };
    },

    /**
     * makes a floating number precise 
     * @params value
     */
    precise: function (n: number): number {
        return parseFloat(n.toPrecision(4));
    },

    /** 
     * checks if a file(or directory) exists
     * @param fileName
     */
    checkFileExists: function (fileName: string) {
        return !!fs.existsSync(fileName);
    },

    /** 
     * creates new directory
     * @param directory - string or array of strings
     */
    createNewDirectory: function (directory: string | string[]) {
        if (typeof directory === 'string') {
            !fs.existsSync(directory) && fs.mkdirSync(directory, { recursive: true });
        } else {
            directory.forEach(dir => {
                !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });
            });
        }
        return true;
    },

    /**
     * makes a get request
     * @param url
     */
    async getRequest(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            request.get(url, (err, res, body) => {
                if (err) reject(err);
                else { resolve(body) }
            });
        });
    },

    /**
     * reads a file from the server
     * @param path - path of the file
     * @param encoding - (optional) to read in encoding
     */
    async readFile(path: string, encoding?: 'utf8'): Promise<any> {
        return new Promise((resolve, reject) => {
            let options: fs.WriteFileOptions = {};
            if (encoding) options.encoding = encoding;
            fs.readFile(path, options, (err, data) => {
                if (err) reject(err);
                else { resolve(data) }
            });
        });
    },

    /**
     * deletes the file from the server
     * @param path - path of the file
     */
    async deleteFile(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) reject(err);
                else { resolve(true) }
            });
        });
    },

    async generateOtp() {
        let min = Math.ceil(1000);
        let max = Math.floor(9999);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomString() {
        return crypto.randomBytes(20).toString('hex');
    },

    deg2rad(deg: number) {
        return deg * (Math.PI / 180)
    },

    getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }



}