const express = require("express");
const router = express.Router();
const authRoutes = require("./auth_routes");
const challengeRoutes = require("./challenge_routes");

router.use("/", authRoutes);

// TODO: auth lock down for challenge base route
router.use("/challenges", challengeRoutes);

module.exports = router;
