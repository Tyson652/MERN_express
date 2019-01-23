const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const ChallengeController = require("../controllers/challenge_controller");
const SubmissionController = require("./../controllers/submission_controller");
const upload = require ("./../config/multer");
const yt = require ("./../services/youtube_service");
const temp = require("./../middleware/temp_file_middleware");
const isAdminMiddleware = require("./../middleware/is_admin_middleware");

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
