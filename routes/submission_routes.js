const express = require("express");
const router = express.Router();
const passport = require("passport");
const { celebrate, Joi } = require("celebrate");
const SubmissionController = require("./../controllers/submission_controller");
const upload = require("./../config/multer");
const yt = require("./../services/youtube_service");
const temp = require("./../middleware/temp_file_middleware");

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
  upload.single("video"),
  // yt.upload,
  // temp,
  SubmissionController.create
);

module.exports = router;
