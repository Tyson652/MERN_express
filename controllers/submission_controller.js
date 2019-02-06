const ChallengeModel = require("./../database/models/challenge_model");
const UserModel = require("./../database/models/user_model");

//// API to get lists of submissions
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
          _id: 0,
          challenge_id: "$_id",
          challenge_title: "$title",
          submission_id: "$submissions._id",
          submission_user_id: "$submissions.user.id",
          submission_user_nickname: "$submissions.user.nickname",
          submission_user_profile_image: "$submissions.user.profile_image",
          submission_title: "$submissions.title",
          submission_description: "$submissions.description",
          submission_video_url: "$submissions.video_url",
          submission_createdAt: "$submissions.createdAt"
        }
      }
    ]);

    return res.json(submissions);
  } catch (error) {
    console.log(error);
    return next(new HTTPError(500, "Unable to get submissions"));
  }
}

//// API to create a new Submission for a Challenge
// @params id: string - challenge ID
// @params title: string
// @params description: string
// @params video_url:string - video url from upload service
// @return challenge: object
async function create(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, video_url } = req.body;
    const { _id, nickname, profile_image } = req.user;

    const challenge = await ChallengeModel.findById(id);
    if (!challenge) {
      return next(new HTTPError(400, "Challenge not found"));
    }

    // Save new submission to challenge object
    challenge.submissions.push({
      title,
      description,
      video_url,
      user: { id: _id, nickname, profile_image }
    });
    await challenge.save();

    // Save challenge details to user
    const user = await UserModel.findById(_id);
    user.submissions.push({
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      challengeDescription: challenge.description,
      video_url
    });
    await user.save();
    return res.status(200).json(challenge);
  } catch (error) {
    console.log(error);
    return next(new HTTPError(500, error.message));
  }
}

// On hold - requires testing
//// API to delete a submission
// async function destroy(req, res, next) {
//   try {
//     const { id, sub_id } = req.params;
//     const challenge = await ChallengeModel.findById(id);
//     challenge.submissions.id(sub_id).remove();
//     challenge.save();
//     return res.status(200).send();
//   } catch (error) {
//     return next(new HTTPError(500, error.message));
//   }
// }

module.exports = {
  index,
  create
  // destroy
};
