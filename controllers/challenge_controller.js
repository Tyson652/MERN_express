const ChallengeModel = require("./../database/models/challenge_model");

// API to get lists ongoing Challenges
// @return challenges: array [{},{}] without submission subdocs
// Stretch: filtering, search, pagination
async function index(req, res, next) {
  try {
    const challenges = await ChallengeModel.aggregate([
      { $match: { expiry_date: { $gt: new Date() } } },
      { $sort: { expiry_date: 1 } }, // most recent first
      { $limit: 50 },
      { $project: { title: 1, description: 1, video: 1, expiry_date: 1 } }
    ]);

    return res.json(challenges);
  } catch (error) {
    return next(error);
  }
}

// TODO: associate challenge creator to a user/brand
// TODO: required user is_admin
// API to create a new Challenge
// @params title: string
// @params description: string
// @params video:string - YouTube URL ID
// @params expiry_date: date
// @return challenge: object
async function create(req, res, next) {
  try {
    let { title, description, video, expiry_date } = req.body;
    const challenge = await ChallengeModel.create({
      title,
      description,
      video,
      expiry_date
    });
    return res.json(challenge);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  index,
  create
};
