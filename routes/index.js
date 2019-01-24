const express = require("express");
const router = express.Router();
const passport = require("passport");

const authRoutes = require("./auth_routes");
const profileRoutes = require("./profile_routes");
const challengeRoutes = require("./challenge_routes");
const submissionRoutes = require("./submission_routes");

// ------ Authentication Routes ------

router.use("/", authRoutes);

// ------ Profile Routes (current user and other users) ------

router.use(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  profileRoutes
);

// ------ Challenges Routes ------

router.use(
  "/challenges",
  passport.authenticate("jwt", { session: false }),
  challengeRoutes
);

// ------ Submissions Routes ------

router.use(
  "/",
  passport.authenticate("jwt", { session: false }),
  submissionRoutes
);

module.exports = router;
