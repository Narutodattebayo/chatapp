

import mongoose from "mongoose";

import { CONFIG, SYS_ERR } from "../../common";

class Mongo {

    constructor() { }

    /**
     * connects to the mongo database
     * @param uri - the new version of mongodb connection string
     */
    async connectDatabase(uri: string) {
        mongoose.connect(uri,
            {
                useNewUrlParser: true,
                useFindAndModify: false,
                poolSize: CONFIG.DB_POOLSIZE
            }
        ).then(
            () => {
                console.log(`SUCCESS: database connected to "${uri}"`);
            },
            (err) => {
                console.log(`ERROR: database failed to connect "${uri}"`);
                console.log('ERROR: ', err);
                process.exit(SYS_ERR.MONGO_CONN_FAILED);
            }
        );
        if (process.env.NODE_ENV !== 'prod') mongoose.set('debug', true);
    }
}

export const mongoDOA = new Mongo();