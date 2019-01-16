const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const UserSchema = require("./user_schema");
const UserModel = mongoose.model("User", UserSchema);

const ChallengeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  video: {
    type: String
  },
  expiry_date: {
    type: Date,
    min: Date.now
  },
  submissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = ChallengeSchema;
