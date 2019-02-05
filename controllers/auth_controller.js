const UserModel = require("./../database/models/user_model");
const JWTService = require("./../services/jwt_service");
const generatePasswordToken = require("./../services/key_generator_service");
const sendResetEmail = require("./../services/reset_password_service");

//// API to create a new User
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

//// API to log in a existing user via local strategy
// @params email: string - passport-local-mongoose requires to be unique by default
// @params password: string
// @return  JWT
async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const { user, error } = await UserModel.authenticate()(email, password);
    if (error) {
      return next(new HTTPError(401, error.message));
    }

    const token = JWTService.generateToken(user);

    return res.json({ token });
  } catch (error) {
    return next(new HTTPError(401, "Incorrect email or password"));
  }
}

//// Change password while logged in App
async function changePassword(req, res, next) {
  const { email, password, new_password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new HTTPError(400, "email address not found"));
  }

  // Changes user's password hash and salt if password (first argument) is correct to newpassword (second argument), else returns default IncorrectPasswordError
  await existingUser.changePassword(password, new_password, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.sendStatus(200);
    }
  });
}

//// Forget Password / Reset Password via Email:

//// Forget Password 1: Send password reset via email with link
// Checks if a user email exists, if so then generates a reset password token and saves on the user model. Then email is sent to the user
async function sendPasswordResetURL(req, res, next) {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ email: "email address not found" });
  }

  const token = generatePasswordToken();

  await user.updateOne({
    resetPasswordToken: token,
    // Valid for one hour
    resetPasswordExpires: Date.now() + 3600000
  });

  sendResetEmail(token, user.email);
  return res.sendStatus(200);
}

//// Forget Password 2: Reset password token
// Verify password token is still valid
async function verifyPasswordToken(req, res, next) {
  const { token } = req.params;
  const user = await UserModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    return res
      .status(400)
      .send("Password reset link is invalid or has expired");
  }

  return res.sendStatus(200);
}

//// Forget Password 3: Reset password
// If user is able to click on the reset password URL, mongo validates the token (passed via params), upon successful validation, user is able to update the password
async function changePasswordViaToken(req, res, next) {
  const { token } = req.params;
  const { password } = req.body;
  const user = await UserModel.findOne({
    resetPasswordToken: token
  });

  if (!user) {
    return res
      .status(400)
      .send("Password reset link is invalid or has expired");
  }
  user.setPassword(password, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      // Removes token as it has been used
      user.resetPasswordToken = "";
      // Saves the save password and deletes token
      user.save();
      return res.sendStatus(200);
    }
  });
}

module.exports = {
  register,
  login,
  changePassword,
  sendPasswordResetURL,
  verifyPasswordToken,
  changePasswordViaToken
};
