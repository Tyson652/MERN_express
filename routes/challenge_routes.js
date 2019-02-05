const express = require("express");
const router = express.Router();
const passport = require("passport");
const { celebrate, Joi } = require("celebrate");
const ChallengeController = require("../controllers/challenge_controller");
const { videoUpload } = require("../services/upload_service");

//// @Base Route '/challenges'

//// Public - get list of challenges for feed
router.get("/", ChallengeController.index);

//// Public - Create a new challenge
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  videoUpload,
  celebrate({
    body: {
      title: Joi.string()
        .trim()
        .min(1)
        .max(60)
        .required(),
      description: Joi.string()
        .trim()
        .max(360),
      expiry_date: Joi.date().min("now"),
      video_url: Joi.string().required()
    }
  }),
  ChallengeController.create
);

//// Challenge creator - delete challenge
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ChallengeController.destroy
);

module.exports = router;
