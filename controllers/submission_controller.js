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
    const { yt_id } = req.file;
    const { title, description } = req.body;
    const { _id, nickname, profile_image } = req.user;

    const challenge = await ChallengeModel.findById(id);
    challenge.submissions.push({
      title,
      description,
      //yt id and url saved to make it easier to delete from youtube api, but also have full video url
      yt_id,
      yt_url: `https://www.youtube.com/watch?v=${yt_id}`,
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
