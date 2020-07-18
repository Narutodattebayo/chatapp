const fcm = require('fcm-node');
import { CONFIG } from "../../common/config.common"

class fcmService {
    private serverKey: string
    private FCM: any
    constructor() {
        this.serverKey = CONFIG.FCM.SERVER_KEY
        this.FCM = new fcm(this.serverKey)
    }

    async sendNotification(tokens: Array<String>) {
        let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: tokens,
            collapse_key: 'your_collapse_key',

            notification: {
                title: 'Title of your push notification',
                body: 'Body of your push notification'
            },

            data: {  //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        };
        this.FCM.send(message)
    }

}

export const Mailer = new fcmService()
