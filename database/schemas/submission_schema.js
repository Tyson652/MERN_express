const { Schema } = require("mongoose");

const SubmissionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  video: {
    type: String,
    required: true
  }
  // likes: [],
});

module.exports = SubmissionSchema;
