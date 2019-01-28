const transporter = require("./../config/mailer");

    // Uses Nodemailer to send a password reset URL
    function resetPasswordService(token) {
        // Mail client content options
        const mailOptions = {
            from: "1up.webapp@gmail.com",
            to: user.email,
            subject: "Link To Reset Password",
            text: `Hi, \n\n You are receiving this because someone has requested the reset of the password for your account.\n\n Please click on the following link to complete the process.\n http://localhost:3000/resetpassword?${token}\n\n If you did not request this, please ignore this email and your password will remain unchanged.` 
            }

        // Function that sends the email
        transporter.sendMail(mailOptions, function(err, response) {
        if (err) {
            console.log('there was an error: ', err);
        } else {
            console.log("here is the response: ", response);
            res.json(token);
            // res.status(200).json("recover email sent");
        }
        });
    }

    module.exports = resetPasswordService;


