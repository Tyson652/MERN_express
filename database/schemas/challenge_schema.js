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
    min: Date.now
  },
  submissions: [SubmissionSchema]
});

module.exports = ChallengeSchema;
