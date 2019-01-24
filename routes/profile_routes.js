const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const ProfileController = require("../controllers/profile_controller");
const { avatarUpload } = require("../services/avatar_upload_service");

// @Base Route '/profile'

const validateCurrentUserUpdates = celebrate({
  body: {
    first_name: Joi.string()
      .max(30)
      .trim(),
    last_name: Joi.string()
      .max(30)
      .trim(),
    bio: Joi.string()
      .max(300)
      .trim(),
    gender: Joi.any().valid("male", "female", "rather not say"),
    age: Joi.number()
      .integer()
      .min(0)
      .max(150),
    location: Joi.string()
      .max(100)
      .trim()
  }
});

// Show current user's profile page
// user object should be already available upon authentication @ req.user
router.get("/info", ProfileController.showCurrent);

// Update current user's profile details
router.patch("/", validateCurrentUserUpdates, ProfileController.updateCurrent);
router.put("/", validateCurrentUserUpdates, ProfileController.updateCurrent);

// TODO: validation image file req.file?
// Update current user's avatar image
router.post("/avatar-upload", avatarUpload, ProfileController.avatarUpdate);

// Show other users' profile page
router.get("/:id", ProfileController.showUser);

module.exports = router;
