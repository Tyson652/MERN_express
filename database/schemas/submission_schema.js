const { Schema } = require("mongoose");

const SubmissionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
  // likes: [],
});

module.exports = SubmissionSchema;
