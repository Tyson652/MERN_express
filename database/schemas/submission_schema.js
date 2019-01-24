const { Schema } = require("mongoose");

const SubmissionSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    yt_id: {
      type: String,
      required: true
    },
    user: {
      id: {
        type: String
      },
      nickname: {
        type: String
      },
      profile_image: {
        type: String
      }
    }
    // likes: [],
  },
  { timestamps: {} }
);

module.exports = SubmissionSchema;
