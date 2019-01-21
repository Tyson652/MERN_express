const express = require("express");
const router = express.Router();
const passport = require("passport");
const authRoutes = require("./auth_routes");
const profileRoutes = require("./profile_routes");
const challengeRoutes = require("./challenge_routes");

// ------ Middleware to find a challenge for controller ------
const ChallengeModel = require("./../database/models/challenge_model");
async function challengeFindMiddleware(req, res, next) {
  if (req.params.id) {
    let challenge = await ChallengeModel.findById(req.params.id);
    req.challenge = challenge;
  }
  next();
}

// ------ Authentication Routes ------
router.use("/", authRoutes);

// ------ Profile Routes ------
// --- Upload Image nested with /profile/image-upload ---
router.use(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  profileRoutes
);

// ------ Challenges & Submissions Routes ------
// --- Submissions nested within /challenges/:id/submissions ---
router.use(
  "/challenges",
  passport.authenticate("jwt", { session: false }),
  challengeFindMiddleware,
  challengeRoutes
);

module.exports = router;
