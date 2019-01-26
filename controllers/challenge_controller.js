const ChallengeModel = require("./../database/models/challenge_model");
const UserModel = require("./../database/models/user_model");

// API to get lists ongoing Challenges
// @return challenges: array [{ challenge }] with submissions subdocs
// Stretch: filtering, search, pagination
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
// @params id: string - of an existing user
// @params title: string
// @params description: string
// @params yt_id:string - YouTube ID from youtube_service.js
// @params expiry_date: date
// @return challenge: object
async function create(req, res, next) {
  try {
    console.log(req.file);
    console.log("inside create challenge cont");
    console.log(req.body);
    let { creator_id, title, description, expiry_date } = req.body;
    const { yt_id } = req.file;
    console.log(yt_id);
    // Creator of the challenge will be set with details from an existing user, query on user's ID
    const existingUser = await UserModel.findById(creator_id);
    if (!existingUser) {
      return next(new HTTPError(400, "User ID not found"));
    }   

    let user = {
      creator_id,
      nickname: existingUser.nickname,
      profile_image: existingUser.profile_image
    };

    const challenge = await ChallengeModel.create({
      user: { ...user },
      title,
      description,
      yt_id,
      expiry_date
    });

    if (!challenge) {
      return next(new HTTPError(422, "Could not create challenge"));
    }

    let challenges =  await ChallengeModel.find({});
    
    // Return all challenges
    console.log("challenge was created in database");
    return res.json(challenges);

  } catch (error) {
    return console.log(error);
    return next(new HTTPError(500, error.message));
  }
}

async function destroy(req, res, next) {
  console.log("inside delete challenge controller");
  const { id } = req.params;
  console.log(req.params);
  const challenge = await ChallengeModel.findByIdAndRemove(id);
  console.log("video was delete from database succesfully");
  if (!challenge) {
    return next(new HTTPError(400, "Challenge ID not found"));
  }
  next();
}

module.exports = {
  index,
  create,
  destroy
};

