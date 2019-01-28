const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

async function sendPasswordResetURL(req, res, next) {
  const { email } = req.body;
  console.log("controller line 55");

    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log("email address not found");
    }
      console.log("user was found");

      const token = crypto.randomBytes(20).toString("hex");
      console.log(token);

      // double check why await is required here, is it because the await above still allows following promises to be ran?
       await user.updateOne({
        resetPasswordToken: token
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "login",
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: "1up.webapp@gmail.com",
        to: user.email,
        subject: "Link To Reset Password",
        text: `Hi, \n\n You are receiving this because someone has requested the reset of the password for your account.\n\n Please click on the following link to complete the process.\n http://localhost:3000/resetpassword?${token}\n\n If you did not request this, please ignore this email and your password will remain unchanged.` 
      }

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

// 
async function changePasswordViaEmail(req, res, next) {
  const { token } = req.params;
  const { password } = req.body;

  const user = await UserModel.findOne({ resetPasswordToken: token });
  if (!user) {
    return console.log("no user");
  }

  user.setPassword(password)
    .then(res => {
      user.save();
      console.log("updated");
    })
    .catch(err => console.log(err))
 
}


module.exports = {
  register,
  login,
  changePassword,
  sendPasswordResetURL,
  changePasswordViaEmail
};
