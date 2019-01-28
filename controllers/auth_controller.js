const nodemailer = require("nodemailer");

const UserModel = require("./../database/models/user_model");
const JWTService = require("./../services/jwt_service");

// API to create a new User
// @params first_name: string
// @params last_name: string
// @params nickname:string
// @params email: string - passport-local-mongoose requires to be unique by default
// @params password: string
// @return  JWT
function register(req, res, next) {
  const { first_name, last_name, nickname, email, password } = req.body;

  const user = new UserModel({
    first_name,
    last_name,
    nickname,
    email
  });

  UserModel.register(user, password, (error, user) => {
    if (error) {
      return next(new HTTPError(500, error.message));
    }

    const token = JWTService.generateToken(user);

    return res.json({ token });
  });
}

// API to log in a existing user via local strategy
// @params email: string - passport-local-mongoose requires to be unique by default
// @params password: string
// @return  JWT
async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const { user, error } = await UserModel.authenticate()(email, password);
    if (error) {
      console.log(error);
      return next(new HTTPError(401, error.message));
    }

    const token = JWTService.generateToken(user);

    return res.json({ token });
  } catch (error) {
    return next(error);
  }
}

// Change password
async function changePassword(req, res, next) {
  const { email, password, newpassword } = req.body;

  const user = await UserModel.findOne({ email });
  
  // Change's user's password hash and salt if password is correct, else returns an IncorrectPasswordError 
  await user.changePassword(password, newpassword)
    .then(res => console.log("password succesfully changed"))
    .catch(err => console.log(err))
}

async function resetPassword(req, res, next) {
  const { email } = req.body;
  console.log("controller line 55");

    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log("email address not found");
    }
      console.log("user was found");

      const token = crypto.randomBytes(20).toString("hex");
      console.log(token);

      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 360000
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: "1up.webapp@gmail.com",
        to: user.email,
        subject: "Link To Reset Password",
        text: `You are receiving this someone has requested the reset of the password for your account. \n Please click on the following link to complete the process within one hour of receieving it. \n http://localhost:3000/resetpassword/${token} \n
        If you did not request this, please ignore this email and your password will remain unchanged.` 
      }

      transporter.sendEmail(mailOptions, function(err, response) {
        if (err) {
          console.log('there was an error: ', err);
        } else {
          console.log("here is the response: ", response);
          res.status(200).json("recover email sent");
        }
      });

}

module.exports = {
  register,
  login,
  changePassword,
  resetPassword
};
