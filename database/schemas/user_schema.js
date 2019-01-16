const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const SubmissionSchema = require("./submission_schema");

//  email: string - from passport-local-mongoose
//  password: string - from passport-local-mongoose, salted and hashed
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
    enum: ["male", "female", "rather not say"]
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

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = UserSchema;
