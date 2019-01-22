const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const SubmissionController = require("./../controllers/submission_controller");

// @Base Route '/'

// Get list of submissions
router.get("/submissions", SubmissionController.index);

// Create a new submission for a challenge
router.post(
  "/challenges/:id/submissions",
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
