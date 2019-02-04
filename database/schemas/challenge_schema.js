const { Schema } = require("mongoose");
const SubmissionSchema = require("./submission_schema");

const ChallengeSchema = new Schema(
  {
    user: {
      creator_id: {
        type: String
      },
      nickname: {
        type: String,
        uppercase: true
      },
      profile_image: {
        type: String
      }
    },
    title: {
      type: String,
      required: true,
      uppercase: true
    },
    description: {
      type: String,
      uppercase: true
    },
    video_url: {
      type: String
    },
    expiry_date: {
      type: Date,
      min: Date.now,
      default: Date.now() + 31536000000 // 1 year from now
    },
    submissions: [SubmissionSchema]
  },
  { timestamps: {} }
);

module.exports = ChallengeSchema;
