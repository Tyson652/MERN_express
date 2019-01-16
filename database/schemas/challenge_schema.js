const { Schema } = require("mongoose");

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
    type: date
  },
  submissions: [
    {
      type: String
    }
  ]
});

module.exports = ChallengeSchema;
