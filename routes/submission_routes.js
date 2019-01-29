const express = require("express");
const router = express.Router();
const passport = require("passport");
const { celebrate, Joi } = require("celebrate");
const SubmissionController = require("./../controllers/submission_controller");
const { videoUpload } = require("../services/upload_service");

// @Base Route '/'

// Public - get list of submissions for feed
router.get("/submissions", SubmissionController.index);

// Users - create a new submission for a challenge
router.post(
  "/challenges/:id/submissions",
  passport.authenticate("jwt", { session: false }),
  // celebrate({
  //   body: {
  //     title: Joi.string().required(),
  //     description: Joi.string(),
  //     video: Joi.string().required()
  //   }
  // }),
  videoUpload,
  SubmissionController.create
);



module.exports = router;
