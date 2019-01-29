const nodemailer = require("nodemailer");

// Config settings for our email client that sends out emails to customers
module.exports = transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "login",
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
    });