const UserModel = require("./../database/models/user_model");

// API to get another user's details
async function show(req, res, next) {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    res.json(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = { show };
