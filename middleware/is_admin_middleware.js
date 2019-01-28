// ------ Middleware to check if current logged in user is_admin ------
const UserModel = require("./../database/models/user_model");

module.exports = async function isAdminMiddleware(req, res, next) {
  try {
    let user = await UserModel.findById(req.user._id);
    if (user.is_admin === true) {
      return next();
    }
    return next(new HTTPError(401, "Only Admins are authorized to do that"));
  } catch (error) {
    return next(error);
  }
};
