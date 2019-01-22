const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const ChallengeController = require("../controllers/challenge_controller");
const SubmissionController = require("./../controllers/submission_controller");
const upload = require ("./../config/multer");
const yt = require ("./../services/youtube_service");
const temp = require("./../middleware/temp_file_middleware");

// @Base Route '/challenges'
// @Nested Routes '/challenges/:id/submissions'
router.post(
  "/:id/submissions", 
  upload.single("video"),
  yt.upload,
  temp,
  SubmissionController.create
);

//challenge upload route
router.post(
  "/upload", 
  upload.single("video"), 
  // yt.upload,
  temp,
  ChallengeController.create
);

//challenge delete route
router.post(
  "/:id/delete",
  yt.destroy,
  ChallengeController.destroy
);

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

// @Nested Submissions Routes

router.post(
  "/:id/submissions",
  celebrate({
    body: {
      title: Joi.string().required(),
      description: Joi.string(),
      video: Joi.string().required()
    }
  }),
  SubmissionController.create
);

module.exports = router;
