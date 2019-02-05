const ChallengeModel = require("./../database/models/challenge_model");
const UserModel = require("./../database/models/user_model");

//// API to get lists ongoing Challenges
// @return challenges: array [{ challenge }] with submissions subdocs
async function index(req, res, next) {
  try {
    const challenges = await ChallengeModel.aggregate([
      { $match: { expiry_date: { $gt: new Date() } } },
      { $sort: { expiry_date: 1 } }, // ascending order
      { $limit: 50 }
    ]);

    return res.json(challenges);
  } catch (error) {
    console.log(error);
    return next(new HTTPError(500, "Unable to get challenges"));
  }
}

//// API to create a new Challenge
// @params id: string - current user
// @params title: string
// @params description: string
// @params video_url:string - video url on AWS S3
// @params expiry_date: date
// @return challenge: object
async function create(req, res, next) {
  try {
    const { _id, nickname, profile_image } = req.user;
    let { title, description, expiry_date } = req.body;
    const video_url = req.videoUrl;

    // Creator of the challenge will be set with details from current user
    const existingUser = await UserModel.findById(_id);
    if (!existingUser) {
      return next(new HTTPError(400, "User ID not found"));
    }

    let user = {
      creator_id: _id,
      nickname,
      profile_image
    };

    const challenge = await ChallengeModel.create({
      user: { ...user },
      title,
      description,
      video_url,
      expiry_date
    });
    console.log(challenge);

    if (!challenge) {
      return next(new HTTPError(422, "Could not create challenge"));
    }

    return res.status(200).json(challenge);
  } catch (error) {
    console.log(error);
    return next(new HTTPError(500, error.message));
  }
}

//// API to permanently delete Challenge and all attached submissions
// @return challenge: object - deleted
async function destroy(req, res, next) {
  try {
    const { id } = req.params;
    // TODO: check req.user._id matches challenge.user_creator._id & Tests
    const challenge = await ChallengeModel.findByIdAndRemove(id);
    return res.status(200).json(challenge);
  } catch (error) {
    return next(new HTTPError(400, error.message));
  }
}

module.exports = {
  index,
  create,
  destroy
};
