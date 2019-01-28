const UserModel = require("./../database/models/user_model");

// API to get current user's profile details
// @return user: object
async function showCurrent(req, res, next) {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    return next(error);
  }
}

// API to update current user's profile details
// @params first_name: string
// @params last_name: string
// @params nickname: string
// @params gender: enum ["male", "female", "rather not say"]
// @params age: number
// @params location: string
// @return user: object
async function updateCurrent(req, res, next) {
  const { _id } = req.user;
  const { first_name, last_name, nickname, gender, age, location } = req.body;

  const updates = {
    first_name: first_name || req.user.first_name,
    last_name: last_name || req.user.last_name,
    nickname: nickname || req.user.nickname,
    gender: gender || req.user.gender,
    age: age || req.user.age,
    location: location || req.user.location
  };
  console.log(updates);
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id
      },
      updates,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    return next(error);
  }
}

// API to update current user's profile image
// @params profile_image:string - AWS_S3 Image URL
// @return user: object
async function avatarUpdate(req, res, next) {
  try {
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    user.profile_image = req.imageUrl;
    await user.save();
    // Refactor: what to do with old image (delete or keep pass images?)
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

// API to get an user's details
// @return user: object
async function showUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    res.json(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = { updateCurrent, avatarUpdate, showUser, showCurrent };
