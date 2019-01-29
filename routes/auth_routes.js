const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const AuthController = require("../controllers/auth_controller");

// @Base Route '/'

// Login exist user
router.post(
  "/login",
  celebrate({
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    }
  }),
  AuthController.login
);

// Register new user
router.post(
  "/register",
  // celebrate({
  //   body: {
  //     first_name: Joi.string()
  //       .min(1)
  //       .max(40)
  //       .required(),
  //     last_name: Joi.string()
  //       .min(1)
  //       .max(40)
  //       .required(),
  //     nickname: Joi.string()
  //       .min(1)
  //       .max(40)
  //       .required(),
  //     email: Joi.string()
  //       .email()
  //       .required(),
  //     password: Joi.string()
  //       .min(6)
  //       .max(40)
  //       .required(),
  //     terms_conditions: Joi.boolean()
  //       .valid(true)
  //       .required()
  //   }
  // }),
  AuthController.register
);

// Reset password token
router.get(
  "/resetpassword/:token",
  AuthController.verifyPasswordToken
);

// Change password
router.put(
  "/changepassword",
  AuthController.changePassword
);

// Send password reset link
router.post(
  "/reseturl",
  AuthController.sendPasswordResetURL
);

// Reset password
router.put(
  "/resetpassword/:token",
  AuthController.changePasswordViaEmail
);

module.exports = router;
