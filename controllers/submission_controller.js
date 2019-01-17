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
    let { id } = req.params;
    let { title, description, video } = req.body;

    const challenge = await ChallengeModel.findById(id);
    challenge.submissions.push({ title, description, video });
    await challenge.save();

    // TODO: add to submission to current user
    // console.log(req.user);
    // const user = await UserModel.findById(req.user);
    // user.submissions.push({
    // challenge or submission ID?
    //   submissionId: challenge.id,
    //   submissionTitle: challenge.title
    // });
    // await user.save();

    return res.json(challenge);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create
};
