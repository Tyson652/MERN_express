const ChallengeModel = require("./../database/models/challenge_model");
const UserModel = require("./../database/models/user_model");

// API to get lists ongoing Challenges
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

// (Admin Only) API to create a new Challenge
// @params id: string - current user
// @params title: string
// @params description: string
// @params yt_id:string - YouTube ID from youtube_service.js
// @params expiry_date: date
// @return challenge: object
async function create(req, res, next) {
  console.log("29");
  try {
    const { _id, nickname, profile_image } = req.user;
    let { title, description, expiry_date } = req.body;

    // Creator of the challenge will be set with details from an existing user, query on user's ID
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
      yt_id,
      expiry_date
    });
    console.log(challenge);

    if (!challenge) {
      console.log("55")
      return next(new HTTPError(422, "Could not create challenge"));
    }

    let challenges = await ChallengeModel.find({});

    // Return all challenges
      return res.json(challenges);
  } catch (error) {
    console.log(error);
    return next(new HTTPError(500, error.message));
  }
}

async function destroy(req, res, next) {
  try {
    console.log("inside delete challenge controller");
    const { id } = req.params;
    await ChallengeModel.findByIdAndRemove(id);
    return res.status(200).send();

  } catch (error) {
    return next(new HTTPError(400, error.message));
  }
}

module.exports = {
  index,
  create,
  destroy
};
