const ChallengeModel = require("./../database/models/challenge_model");

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
  create
};
