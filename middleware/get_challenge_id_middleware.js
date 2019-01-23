// ------ Middleware to find a challenge for controller ------
const ChallengeModel = require("./../database/models/challenge_model");

module.exports = async function getChallengeIdMiddleware(req, res, next) {
  if (req.params.id) {
    let challenge = await ChallengeModel.findById(req.params.id);
    req.challenge = challenge;
  }
  next();
};
