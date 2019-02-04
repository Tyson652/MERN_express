require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const HTTPError = require("./../../errors/HTTPError");
const ChallengeModel = require("../../database/models/challenge_model");
const UserModel = require("../../database/models/user_model");
const JWTService = require("./../../services/jwt_service");

let token = undefined;
let user_admin = undefined;
let created_challenge = undefined;

beforeAll(async () => {
  global.HTTPError = HTTPError;
  mongoose.connect("mongodb://localhost/1up_api_test", {
    useNewUrlParser: true
  });
  mongoose.Promise = global.Promise;
  mongoose.connection.on("error", err => console.log(err));

  user_admin = new UserModel({
    first_name: "first_admin",
    last_name: "last_admin",
    nickname: "nick_admin",
    email: "challenge_admin@mail.com",
    profile_image: "profile_url",
    is_admin: true
  });
  await user_admin.setPassword("password");
  await user_admin.save();
  token = JWTService.generateToken(user_admin);
});

afterAll(async () => {
  // await ChallengeModel.deleteOne({  title: "title_challenge" });
  await UserModel.deleteOne({ email: "challenge_admin@mail.com" });
  mongoose.connection.close();
});

const created_challenge_data = {
  user: {
    creator_id: "123create_id789",
    nickname: "123nickname789",
    profile_image: "123profile_image789"
  },
  title: "title_challenge",
  description: "description_challenge",
  video_url: "video_url_challenge"
};

// ---------------- Create Tests ----------------

describe("Admin can create a new challenge", () => {
  //   test("POST /challenges with valid req body", async () => {
  //     const video_url = "DepakUSDtQE";

  //     const response = await supertest(app)
  //       .post("/challenges")
  //       .set("Authorization", `Bearer ${token}`)
  //       // .send({
  //       //   creator_id: user_admin._id,
  //       //   title: "Challenge_title",
  //       //   description: "Challenge_description",
  //       //   expiry_date: 1550207394430
  //       // })
  //      .field("creator_id", `${user_admin._id}`)
  //       .field("title", "Challenge_title")
  //       .field("description", "Challenge_description")
  //       .field("expiry_date", 1550207394430)
  //       .attach("attachment", "./tests/data/test_video.mp4")
  //       .expect(200);
  //     console.log("create chaleenge", response);
  //     const createdChallenge = await ChallengeModel.findOne({
  //       description: "Challenge_description"
  //     });

  //     expect(createdChallenge).toBeTruthy;
  //     expect(createdChallenge.title).toBe("Challenge_title");
  //   });

  test("POST /challenges with invalid creator_id", async () => {
    const response = await supertest(app)
      .post("/challenges")
      .set("Authorization", `Bearer ${token}`)
      .field("creator_id", "invalid")
      .field("title", "invalid_title")
      .field("description", "invalid_description")
      .field("expiry_date", "invalid")
      .attach("attachment", "./tests/data/test_video.mp4")
      .expect(404);

    const invalidChallenge = await ChallengeModel.findOne({
      description: "invalid_description"
    });

    expect(invalidChallenge).toBeFalsy;
  });

  test("POST /challenges with invalid body", async () => {
    const response = await supertest(app)
      .post("/challenges")
      .set("Authorization", `Bearer ${token}`)
      .field("creator_id", `${user_admin._id}`)
      .field("title", "invalid_title")
      .field("description", "invalid_description")
      .field("expiry_date", "invalid")
      .attach("attachment", "./tests/data/test_video.mp4")
      .expect(500);

    const invalidChallenge = await ChallengeModel.findOne({
      description: "invalid_description"
    });

    expect(invalidChallenge).toBeFalsy;
  });
});

// ---------------- Index Tests ----------------

describe("Get list of challenges", () => {
  test("GET /challenges expect status 200", async () => {
    created_challenge = await ChallengeModel.create(created_challenge_data);
    const response = await supertest(app)
      .get("/challenges")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  test("GET /challenges returns an array with values", async () => {
    const response = await supertest(app)
      .get("/challenges")
      .set("Authorization", `Bearer ${token}`);

    const isArray = typeof response.body;
    expect(isArray[0]).toBeTruthy();
  });
});
