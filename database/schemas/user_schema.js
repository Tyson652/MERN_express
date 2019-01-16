const { Schema } = require("mongoose");
const SubmissionSchema = require("./submission_schema");

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  is_verified: {
    type: boolean,
    default: false
  },
  profile_image: {
    type: String
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  is_admin: {
    type: boolean,
    default: false
  },
  submissions: [SubmissionSchema]
});

module.exports = UserSchema;
