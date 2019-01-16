const { Schema } = require("mongoose");
const SubmissionSchema = require("./submission_schema");

//  email: string from passport
//  password: string from passport
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
    type: Boolean,
    default: false
  },
  profile_image: {
    type: String
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Rather not say"]
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  },
  location: {
    type: String
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  submissions: [SubmissionSchema]
});

module.exports = UserSchema;
