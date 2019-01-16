const mongoose = require("mongoose");
const ChallengeSchema = require("./../schemas/challenge_schema");

const ChallengeModel = mongoose.model("Challenge", ChallengeSchema);

module.exports = ChallengeModel;
