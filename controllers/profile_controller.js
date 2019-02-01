const UserModel = require("./../database/models/user_model");

// API to get current user's profile details
// @return user: object
function showCurrent(req, res, next) {
  try {
    const user = req.user;
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

// API to update current user's profile details
// @params first_name: string
// @params last_name: string
// @params bio: string
// @params gender: enum ["male", "female", "rather not say"]
// @params age: number
// @params location: string
// @return user: object
async function updateCurrent(req, res, next) {
  const { _id } = req.user;
  const {
    first_name,
    last_name,
    nickname,
    bio,
    gender,
    age,
    location
  } = req.body;

  const updates = {
    first_name: first_name || req.user.first_name,
    last_name: last_name || req.user.last_name,
    nickname: nickname || req.user.nickname,
    bio: bio || req.user.bio,
    gender: gender || req.user.gender,
    age: age || req.user.age,
    location: location || req.user.location
  };

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(_id, updates, {
      new: true
    });

    if (!updatedUser) {
      return next(new HTTPError(500, "Unable to update profile"));
    }

    res.json(updatedUser);
  } catch (error) {
    return next(new HTTPError(500, error.message));
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
    return next(new HTTPError(500, error.message));
  }
}

// API to get an user's details
// @return user: object
async function showUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id, {
      is_verified: 0,
      is_admin: 0,
      createdAt: 0,
      updatedAt: 0
    });

    res.json(user);
  } catch (error) {
    console.log(error);
    return next(new HTTPError(500, "User not found"));
  }
}

module.exports = { updateCurrent, avatarUpdate, showUser, showCurrent };
