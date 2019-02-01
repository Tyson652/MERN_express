const express = require("express");
const router = express.Router();
const authRoutes = require("./auth_routes");
const profileRoutes = require("./profile_routes");
const challengeRoutes = require("./challenge_routes");
const submissionRoutes = require("./submission_routes");

//// ------ Authentication Routes ------

router.use("/", authRoutes);

//// ------ Profile Routes (current user and other users) ------

router.use("/profile", profileRoutes);

//// ------ Challenges Routes ------

router.use("/challenges", challengeRoutes);

//// ------ Submissions Routes ------

router.use("/", submissionRoutes);

module.exports = router;
