const ChallengeModel = require("./../database/models/challenge_model");
const UserModel = require("./../database/models/user_model");

// API to get lists ongoing Challenges
// @return challenges: array [{ challenge }] with submissions subdocs
// Stretch: filtering, search, pagination
async function index(req, res, next) {
  try {
    const challenges = await ChallengeModel.aggregate([
      { $match: { expiry_date: { $gt: new Date() } } },
      { $sort: { expiry_date: 1 } }, // most recent first
      { $limit: 50 }
      // { $project: { title: 1, description: 1, video: 1, expiry_date: 1 } }
    ]);

    return res.json(challenges);
  } catch (error) {
    return next(error);
  }
}

// API (Admin Only) to create a new Challenge
// @params nickname: string - of an existing user
// @params title: string
// @params description: string
// @params video:string - YouTube URL
// @params expiry_date: date
// @return challenge: object
async function create(req, res, next) {
  try {
    let { nickname, title, description, video, expiry_date } = req.body;

    // Creator of the challenge will be an existing user, query on nickname
    const existingUser = await UserModel.findOne({ nickname });
    let user = {
      id: existingUser._id,
      nickname: existingUser.nickname,
      profile_image: existingUser.profile_image
    };

    const challenge = await ChallengeModel.create({
      user: { ...user },
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
