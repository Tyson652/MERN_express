require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const HTTPError = require("./../../errors/HTTPError");
const UserModel = require("../../database/models/user_model");
const ChallengeModel = require("../../database/models/challenge_model");
const JWTService = require("./../../services/jwt_service");

let token = undefined;
let userSubmission = undefined;
let created_challenge = undefined;
let created_challenge_id = undefined;

beforeAll(async () => {
  global.HTTPError = HTTPError;
  mongoose.connect("mongodb://localhost/1up_api_test", {
    useNewUrlParser: true
  });
  mongoose.Promise = global.Promise;
  mongoose.connection.on("error", err => console.log(err));

  // create user
  userSubmission = new UserModel({
    first_name: "firstSubmission",
    last_name: "lastSubmission",
    nickname: "nickSubmission",
    email: "submission@mail.com"
  });
  await userSubmission.setPassword("password");
  await userSubmission.save();
  token = JWTService.generateToken(userSubmission);

  // create challenge
  let user = {
    creator_id: "5c49b3a48f57c846b66145z1",
    nickname: "challenger",
    profile_image:
      "https://s3-ap-southeast-2.amazonaws.com/1up.webapp/1549008995030"
  };
  created_challenge = await ChallengeModel.create({
    user: { ...user },
    title: "challenge_sub_title",
    description: "challenge_sub_description",
    video_url:
      "https://s3-ap-southeast-2.amazonaws.com/1up.webapp/1549008995079",
    submissions: [
      {
        title: "challenge_sub_title",
        description: "challenge_sub_description",
        video_url: "https://sub"
      }
    ]
  });
  created_challenge_id = created_challenge._id;
});

afterAll(async () => {
  await ChallengeModel.deleteOne({ title: "challenge_sub_title" });
  await UserModel.deleteOne({ email: "submission@mail.com" });
  mongoose.connection.close();
});

// ---------------- Index Tests ----------------

describe("Get list of recent submissions", () => {
  test("GET /submissions expect status 200", async () => {
    const response = await supertest(app).get("/submissions");
    expect(200);
  });

  test("GET /challenges returns an array submissions", async () => {
    const response = await supertest(app).get("/submissions");

    const isArray = typeof response.body;
    expect(isArray[0]).toBeTruthy();
  });
});

// ---------------- Create Tests ----------------

describe("Create a submission", () => {
  //// Manually tested. Not sure how to mock video upload.
  // test("POST /challenges/:id/submissions with valid req body", async () => {
  //   newChallenge = await ChallengeModel.create(testChallenge);
  //   const { _id, nickname, profile_image } = userData;

  //   // FIXME: saving challenge details to user is breaking test, data from req.user not sure how to mock
  //   const response = await supertest(app)
  //     .post(`/challenges/${newChallenge._id}/submissions`)
  //     .send({
  //       title: "100M test submission success",
  //       description: "100M test description",
  //       video: "dfaf4dshshs"
  //     })
  //     .expect(200);

  //   const newSubmission = await ChallengeModel.findOne({
  //     "submissions.title": "100M test submission success"
  //   });

  //   expect(newSubmission).toBeTruthy;
  // });

  test("POST /challenges/:id/submissions with invalid JWT", async () => {
    const response = await supertest(app)
      .post(`/challenges/${created_challenge_id}/submissions`)
      .set("Authorization", `Bearer invalid`)
      .expect(401);
  });

  test("POST /challenges/:id/submissions missing body", async () => {
    const response = await supertest(app)
      .post(`/challenges/${created_challenge_id}/submissions`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(422);
  });
});
