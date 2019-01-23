const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const ChallengeController = require("../controllers/challenge_controller");
const isAdminMiddleware = require("./../middleware/is_admin_middleware");

// @Base Route '/challenges'

// Get list of challenges with their submissions
router.get("/", ChallengeController.index);

// Admin Only - Create a new challenge
router.post(
  "/",
  isAdminMiddleware,
  celebrate({
    body: {
      nickname: Joi.string()
        .trim()
        .required(),
      title: Joi.string()
        .trim()
        .required(),
      description: Joi.string().trim(),
      video: Joi.string().trim(),
      expiry_date: Joi.date().min("now")
    }
  }),
  ChallengeController.create
);

module.exports = router;
