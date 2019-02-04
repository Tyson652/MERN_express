const express = require("express");
const router = express.Router();
const passport = require("passport");
const { celebrate, Joi } = require("celebrate");
const ChallengeController = require("../controllers/challenge_controller");
const isAdminMiddleware = require("./../middleware/is_admin_middleware");
const { videoUpload } = require("../services/upload_service");

//// @Base Route '/challenges'

//// Public - get list of challenges for feed
router.get("/", ChallengeController.index);

//// Public - Create a new challenge
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  // isAdminMiddleware,
  videoUpload,

  // Fix me - how to handle video_url = req.videoUrl?
  // celebrate({
  //   body: {
  //     title: Joi.string()
  //       .trim()
  //       .required(),
  //     description: Joi.string().trim(),
  //     expiry_date: Joi.date().min("now")
  //   }
  // }),

  ChallengeController.create
);

//// Challenge creator - delete challenge
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ChallengeController.destroy
);

module.exports = router;
