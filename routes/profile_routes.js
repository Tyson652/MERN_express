const express = require("express");
const router = express.Router();
const passport = require("passport");
const { celebrate, Joi } = require("celebrate");
const ProfileController = require("../controllers/profile_controller");
const { avatarUpload } = require("../services/upload_service");

//// @Base Route '/profile'

//// Public - show an user's profile page
router.get("/:id", ProfileController.showUser);

//// Current User - show current user's own profile page
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  ProfileController.showCurrent
);

const validateCurrentUserUpdates = celebrate({
  body: {
    first_name: Joi.string()
      .trim()
      .min(1)
      .max(30),
    last_name: Joi.string()
      .trim()
      .min(1)
      .max(30),
    nickname: Joi.string()
      .trim()
      .min(1)
      .max(30),
    bio: Joi.string()
      .trim()
      .min(1)
      .max(300),
    gender: Joi.any().valid("male", "female", "gender-neutral"),
    age: Joi.number()
      .integer()
      .min(0)
      .max(150),
    location: Joi.string()
      .trim()
      .max(100)
  }
});

//// Current User - update user's own profile details
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

//// Current User - update current user's avatar image
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  avatarUpload,
  celebrate({
    body: {
      image_url: Joi.string().required()
    }
  }),
  ProfileController.avatarUpdate
);

module.exports = router;
