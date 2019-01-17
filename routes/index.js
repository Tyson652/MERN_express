const express = require("express");
const router = express.Router();
const authRoutes = require("./auth_routes");
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

// ------ Challenges & Submissions Routes ------
// Submissions nested within /challenges/:id/submissions
// TODO: required login user
router.use("/challenges", challengeFindMiddleware, challengeRoutes);

module.exports = router;
