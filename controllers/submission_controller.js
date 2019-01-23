const ChallengeModel = require("./../database/models/challenge_model");
const UserModel = require("./../database/models/user_model");

// API to get lists of submissions
// @return submission: array [{ submission }]
async function index(req, res, next) {
  try {
    const submissions = await ChallengeModel.aggregate([
      { $match: { "submissions.0": { $exists: true } } },
      { $unwind: "$submissions" },
      { $sort: { "submissions.createdAt": -1 } }, // most recent first
      { $limit: 50 },
      {
        $project: {
          title: 1,
          submission_id: "$submissions._id",
          submission_title: "$submissions.title",
          submission_description: "$submissions.description",
          submission_video: "$submissions.video",
          submission_createdAt: "$submissions.createdAt",
          submission_user_id: "$submissions.user.id",
          submission_user_nickname: "$submissions.user.nickname",
          submission_user_profile_image: "$submissions.user.profile_image"
        }
      }
    ]);

    return res.json(submissions);
  } catch (error) {
    console.log(error);
    return next(new HTTPError(500, "Unable to get submissions"));
  }
}

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

    if (!challenge) {
      return next(new HTTPError(400, "Challenge not found"));
    }

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
    return next(new HTTPError(500, error.message));
  }
}

module.exports = {
  index,
  create
};
