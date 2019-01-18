const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const ProfileController = require("../controllers/profile_controller");

// @Base Route '/profile'

// Show other users' profile page
router.get("/:id", ProfileController.show);

module.exports = router;
