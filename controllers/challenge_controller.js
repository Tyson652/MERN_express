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
// @params video:string - YouTube URL
// @params expiry_date: date
// @return challenge: object
async function create(req, res, next) {
  console.log("inside challenge cont");
  try {
    let { creator_id, title, description, expiry_date } = req.body;
    // const { yt_id } = req.file;
    const yt_id = 1;
    console.log(req.body, req.file);
    
    // Creator of the challenge will be set with details from an existing user, query on user's ID
    console.log(creator_id);
    const existingUser = await UserModel.findById(creator_id);
    console.log(existingUser);
    if (!existingUser) {
      return next(new HTTPError(400, "User ID not found"));
    }
    

    let user = {
      creator_id,
      nickname: existingUser.nickname,
      profile_image: existingUser.profile_image
    };
    console.log(user);

    const challenge = await ChallengeModel.create({
      user: { ...user },
      title,
      description,
      yt_id,
      expiry_date
    });
    console.log(challenge);

    if (!challenge) {
      return next(new HTTPError(422, "Could not create challenge"));
    }

    return res.json(challenge);
  } catch (error) {
    return next(new HTTPError(500, error.message));
  }
}

async function destroy(req, res, next) {
  const { id } = req.params;

  const challenge = await ChallengeModel.findByIdAndRemove(id);
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

//duplicate code
// async function create(req, res, next) {
//   try {
//     let { title, description, video, expiry_date } = req.body;
//     const challenge = await ChallengeModel.create({
//       title,
//       description,
//       video,
//       expiry_date
//     });
//     return res.json(challenge);
//   } catch (error) {
//     return next(error);
//   }
// }

//req body
// { title: 'title', desc: 'desc' }
// //req file
// { fieldname: 'video',
//   originalname: 'sample.mov',
//   encoding: '7bit',
//   mimetype: 'video/quicktime',
//   destination: '/var/folders/st/jb30jn5n2_x6gqn9bbt8_8jw0000gn/T',
//   filename: 'video-1548070551077',
//   path: '/var/folders/st/jb30jn5n2_x6gqn9bbt8_8jw0000gn/T/video-1548070551077',
//   size: 2926364,
//   youtubeid: 'QVM6tvs-A4w' }
// //req user
// { is_verified: false,
//   is_admin: false,
//   _id: 5c4507120b27d51f474e5d4f,
//   first_name: 'james',
//   last_name: 'duong',
//   nickname: 'jd',
//   email: 'james@gmail.com',
//   submissions: [],
//   createdAt: 2019-01-20T23:41:07.209Z,
//   updatedAt: 2019-01-20T23:41:07.209Z,
//   __v: 0 }
//
