/**
 * @file mailer.service
 * @description defines mailer methods
 * @created 2019-07-26 18:05:05
 * @author Desk Now Dev Team
*/

import Nodemailer from 'nodemailer';
import { CONFIG } from '../common';

class MailerClass {
    private sender: string;
    private transporter: any;

    constructor(senderName: string) {
        this.sender = `${senderName}<${CONFIG.SYS_EMAIL}>`;
        this.transporter = Nodemailer.createTransport(
            {
                // host: 'mail.appinventive.com',
                // port: 587,
                // secure: false,
                service: 'gmail',
                auth: {
                    user: CONFIG.SYS_EMAIL,
                    pass: CONFIG.SYS_PASSWORD
                },
                
            }
        );
    }

    /**
     * sends the email to the reciever
     * @param mailOptions - consists the reciever, subject, and text
    */
    async sendMail(mailOptions: { to: string, subject: string, text?: string, html?: string, from?: string }) {
        // throw error if either of reciever, subject or content is not provided
        if (!mailOptions.to) Promise.reject('Email reciever not provided in the mailer options');
        if (!mailOptions.subject) Promise.reject('Email subject not provided in the mailer options');
        if (!mailOptions.text && !mailOptions.html) Promise.reject('Email content not provided in the mailer options');

        // add sender to mail options
        mailOptions['from'] = this.sender;
        if (process.env.NODE_ENV !== '_development') {
            let emailSentResponse = await this.transporter.sendMail(mailOptions);
            if (emailSentResponse) {
                console.log(`EMAIL [messageId: ${emailSentResponse.messageId}] TO [recieptens: ${emailSentResponse.envelope.to}]`)
                return true;
            } else return false;
        } else return true;
    }

   

  
}

export const Mailer = new MailerClass('Desk Now Support')

