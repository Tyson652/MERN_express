const express = require("express");
const router = express.Router();
const challengeRoutes = require("./challenge_route");

router.get("/", (req, res) => res.send("Welcome"));

// TODO: auth for challenge base route
router.use("/challenges", challengeRoutes);

module.exports = router;
