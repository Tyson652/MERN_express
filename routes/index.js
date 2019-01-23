const express = require("express");
const router = express.Router();
const passport = require("passport");

const authRoutes = require("./auth_routes");
const profileRoutes = require("./profile_routes");
const challengeRoutes = require("./challenge_routes");
const submissionRoutes = require("./submission_routes");

// const getChallengeIdMiddleware = require("./../middleware/get_challenge_id_middleware");

// ------ Authentication Routes ------

router.use("/", authRoutes);

// ------ Profile Routes (current user and other users) ------
//    --- Upload Image nested with /profile/image-upload ---

router.use(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  profileRoutes
);

// ------ Challenges Routes ------

router.use(
  "/challenges",
  // passport.authenticate("jwt", { session: false }),
  // challengeFindMiddleware,
  challengeRoutes
);

// ------ Submissions Routes ------
//     --- Create Submissions nested within /challenges/:id/submissions ---
router.use(
  "/",
  passport.authenticate("jwt", { session: false }),
  // getChallengeIdMiddleware,
  submissionRoutes
);

module.exports = router;
