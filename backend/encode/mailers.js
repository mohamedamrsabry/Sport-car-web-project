const nodemailer = require('nodemailer');
const mailConfig = require('../config/mailConfig');

const transporter = nodemailer.createTransport({
    service: mailConfig.service,
    auth: mailConfig.auth
});

module.exports.sendSubscriptionEmail = async (toEmail) => {
    const mailOptions = {
        from: mailConfig.from,
        to: toEmail,
        subject: mailConfig.subject,
        html: `
            <h2>Thank you for subscribing to Strada Auto!</h2>
            <p>You'll now receive updates about our latest luxury vehicles and exclusive offers.</p>
            <p>If this was a mistake, please ignore this email.</p>
            <p>Best regards,<br/>Strada Auto Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};