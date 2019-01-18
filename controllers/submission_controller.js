const ChallengeModel = require("./../database/models/challenge_model");
const UserModel = require("./../database/models/user_model");

// API to create a new Submission for a Challenge
// @params id: string - challenge ID from middleware
// @params title: string
// @params description: string
// @params video:string - YouTube URL ID
// @return challenge: object
async function create(req, res, next) {
  try {
    // Save new submission to challenge object
    const { id } = req.params;
    const { title, description, video } = req.body;
    const { _id, nickname, profile_image } = req.user;

    const challenge = await ChallengeModel.findById(id);
    challenge.submissions.push({
      title,
      description,
      video,
      user: { id: _id, nickname, profile_image }
    });
    await challenge.save();

    // Save challenge details to user
    const user = await UserModel.findById(_id);
    user.submissions.push({
      challengeId: challenge.id,
      challengeTitle: challenge.title
    });
    await user.save();

    return res.json(challenge);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create
};
