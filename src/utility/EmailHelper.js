const nodemailer = require('nodemailer');
//const smtpTransport = require('nodemailer-smtp-transport');

const EmailSend = async (email, EmailText, EmailSubject) => {
    try {
        let transporter = nodemailer.createTransport({
            host: 'mail.teamrabbil.com',
            port: 25,
            secure: false,
            auth: {
                user: "info@teamrabbil.com",
                pass: '~sR4[bhaC[Qs'
            },tls: {
                rejectUnauthorized: false
            },
        });


        let mailOptions = {
            from: 'Ecommerce joy <info@teamrabbil.com>',
            to: email,
            subject: EmailSubject,
            text: EmailText
        };

        try {
            let info = await transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
        } catch (error) {
            console.error("Error sending email: ", error);
        }
    }
    catch (error) {
        console.error("Error sending email: ", error);
    }
}

module.exports = EmailSend;