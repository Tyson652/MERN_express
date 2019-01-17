const { Schema } = require("mongoose");
const SubmissionSchema = require("./submission_schema");

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
    min: Date.now,
    default: Date.now() + 31536000000 // 1 year from now
  },
  submissions: [SubmissionSchema]
});

module.exports = ChallengeSchema;
