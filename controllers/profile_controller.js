const UserModel = require("./../database/models/user_model");

// // Show current user's profile page
// router.get("/", ProfileController.showCurrent);

// // Update current user's profile page
// router.patch("/", ProfileController.updateCurrent);
// router.put("/", ProfileController.updateCurrent);

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

// API to get another user's details
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

module.exports = { avatarUpdate, showUser };
