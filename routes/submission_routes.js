const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const SubmissionController = require("./../controllers/submission_controller");
const upload = require ("./../config/multer");
const yt = require ("./../services/youtube_service");
const temp = require("./../middleware/temp_file_middleware");

// @Base Route '/'

// User uploading a challenge submission
router.post(
    "/challenges/:id/submissions", 
    upload.single("video"),
    // yt.upload,
    temp,
    SubmissionController.create
  );

// Get list of submissions
router.get("/submissions", SubmissionController.index);

// Create a new submission for a challenge
// router.post(
//   "/challenges/:id/submissions",
//   celebrate({
//     body: {
//       title: Joi.string().required(),
//       description: Joi.string(),
//       video: Joi.string().required()
//     }
//   }),
//   SubmissionController.create
// );

module.exports = router;
