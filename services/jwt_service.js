const JWT = require("jsonwebtoken");
// TODO: expiry set at 30 days for development, review for production
const expiry = "30d";

function generateToken(user) {
  const token = JWT.sign(
    {
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: expiry
    }
  );

  return token;
}

module.exports = {
  generateToken
};
