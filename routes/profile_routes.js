const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const ProfileController = require("../controllers/profile_controller");
const { avatarUpload } = require("../services/avatar_upload_service");

// @Base Route '/profile'

// // Show current user's profile page
// router.get("/", ProfileController.showCurrent);

// // Update current user's profile page
// router.patch("/", ProfileController.updateCurrent);
// router.put("/", ProfileController.updateCurrent);

// Update current user's profile avatar image
router.post("/avatar-upload", avatarUpload, ProfileController.avatarUpdate);

// Show other users' profile page
router.get("/:id", ProfileController.showUser);

module.exports = router;
