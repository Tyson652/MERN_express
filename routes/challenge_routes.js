const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const ChallengeController = require("../controllers/challenge_controller");
const SubmissionController = require("./../controllers/submission_controller");

//multer
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// @Base Route '/challenges'
// @Nested Routes '/challenges/:id/submissions'

//challenge upload route
router.post(
  "/upload", upload.single("video"),
  ChallengeController.upload
);

router.get("/", ChallengeController.index);

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
