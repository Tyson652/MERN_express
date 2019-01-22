const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const ChallengeController = require("../controllers/challenge_controller");

// @Base Route '/challenges'

// Get list of challenges
router.get("/", ChallengeController.index);

// TODO
// router.get("/:id", ChallengeController.show);

// Create a challenge
router.post(
  "/",
  celebrate({
    body: {
      title: Joi.string().required(),
      description: Joi.string(),
      video: Joi.string(),
      expiry_date: Joi.date().min("now")
    }
  }),
  ChallengeController.create
);

module.exports = router;
