/**
 * @file server
 * @description the server entry point
 * @created 2019-05-19 00:10:59
*/

import { CONFIG } from "./common";
import App from "./app";
import { SocketClass } from "./socket/index"
//import { SocketIO } from "@services";

// create server and start listening on port
let server = App.instance.listen(CONFIG.APP_PORT);

// initiliaze socket instance
SocketClass.getSocket(server);

// add server listener
server.on('listening', function () {
    console.log(`Server started listening on port ${CONFIG.APP_PORT}`);
});