const ChallengeModel = require("./../database/models/challenge_model");

// API to get lists ongoing Challenges
// @return challenges: array [{},{}] without submission subdocs
async function index(req, res, next) {
  try {
    const challenges = await ChallengeModel.aggregate([
      { $match: { expiry_date: { $gt: new Date() } } },
      { $sort: { expiry_date: 1 } }, // most recent first
      { $limit: 50 },
      { $project: { title: 1, description: 1, video: 1, expiry_date: 1 } }
    ]);

    return res.json(challenges);
  } catch (error) {
    return next(error);
  }
}

// TODO: associate challenge creator to a user/brand
// TODO: required user is_admin
// API to create a new Challenge
// @params title: string
// @params description: string
// @params video:string - YouTube URL ID
// @params expiry_date: date
// @return challenge: object

//challenge upload
async function create(req, res, next) {
  console.log("challenge controller ran");
  console.log(req.body);
  console.log(req.file);
  const { title, description } = req.body;
  const { yt_id } = req.file;

  const challenge = new ChallengeModel ({
    title,
    description,
    yt_url: `https://www.youtube.com/watch?v=${yt_id}`
  });
  console.log("here");
  return res.json(challenge);
}

module.exports = {
  index,
  create
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
