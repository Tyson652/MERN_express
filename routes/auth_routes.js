const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const AuthController = require("../controllers/auth_controller");

// @Base Route '/'

router.post(
  "/register",
  celebrate({
    body: {
      first_name: Joi.string()
        .min(1)
        .max(40)
        .required(),
      last_name: Joi.string()
        .min(1)
        .max(40)
        .required(),
      nickname: Joi.string()
        .min(1)
        .max(40)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(40)
        .required(),
      terms_conditions: Joi.string().regex(/^true$/)
    }
  }),
  AuthController.register
);

module.exports = router;
