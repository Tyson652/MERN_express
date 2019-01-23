// ------ Middleware to check if current logged in user is_admin ------
const UserModel = require("./../database/models/user_model");

module.exports = async function getChallengeIdMiddleware(req, res, next) {
  try {
    let user = await UserModel.findById(req.user._id);
    if (user.is_admin === true) {
      return next();
    }

    throw "Only Admins are authorized to do that";
  } catch (error) {
    return next(error);
  }
};
