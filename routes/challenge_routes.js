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

//// Admin Only - Create a new challenge
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  // isAdminMiddleware,
  videoUpload,

  // Fix me
  // celebrate({
  //   body: {
  //     creator_id: Joi.string()
  //       .trim(),
  //       // .required(),
  //     title: Joi.string()
  //       .trim()
  //       .required(),
  //     video: Joi.any(),
  //     description: Joi.string().trim(),
  //     expiry_date: Joi.date().min("now")
  //   }
  // }),
  // upload.single("video"),
  ChallengeController.create
);

//// Challenge delete route
router.delete(
  "/submissions/:id",
  passport.authenticate("jwt", { session: false }),
  ChallengeController.destroy
);

module.exports = router;
