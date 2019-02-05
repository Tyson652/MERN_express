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
  videoUpload,
  celebrate({
    body: {
      title: Joi.string()
        .trim()
        .required(),
      description: Joi.string().trim(),
      video_url: Joi.string().required()
    }
  }),
  SubmissionController.create
);

// On hold - requires testing
// router.delete(
//   "/challenges/:id/submission/:sub_id",
//   passport.authenticate("jwt", { session: false }),
//   SubmissionController.destroy
// )

module.exports = router;
