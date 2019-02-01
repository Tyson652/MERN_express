const express = require("express");
const router = express.Router();
const passport = require("passport");
const { celebrate, Joi } = require("celebrate");
const ProfileController = require("../controllers/profile_controller");
const { avatarUpload } = require("../services/upload_service");

// @Base Route '/profile'

// Public - show an user's profile page
router.get("/:id", ProfileController.showUser);

// User- show current user's own profile page
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  ProfileController.showCurrent
);

const validateCurrentUserUpdates = celebrate({
  body: {
    first_name: Joi.string()
      .max(30)
      .trim(),
    last_name: Joi.string()
      .max(30)
      .trim(),
    nickname: Joi.string()
      .max(30)
      .trim(),
    bio: Joi.string()
      .max(300)
      .trim(),
    gender: Joi.any().valid("male", "female", "gender-neutral"),
    age: Joi.number()
      .integer()
      .min(0)
      .max(150),
    location: Joi.string()
      .max(100)
      .trim()
  }
});

// User - update current user's profile details
router.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateCurrentUserUpdates,
  ProfileController.updateCurrent
);
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateCurrentUserUpdates,
  ProfileController.updateCurrent
);


// User - update current user's avatar image
// TODO?: validation image file req.file?
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  avatarUpload,
  ProfileController.avatarUpdate
);

module.exports = router;
