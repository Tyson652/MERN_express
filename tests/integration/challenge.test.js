require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const HTTPError = require("./../../errors/HTTPError");
const ChallengeModel = require("../../database/models/challenge_model");
const UserModel = require("../../database/models/user_model");
const JWTService = require("./../../services/jwt_service");

let token = undefined;
let userChallenge = undefined;
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
  userChallenge = new UserModel({
    first_name: "firstChallenge",
    last_name: "lastChallenge",
    nickname: "nickChallenge",
    email: "challenge@mail.com"
  });
  await userChallenge.setPassword("password");
  await userChallenge.save();
  token = JWTService.generateToken(userChallenge);

  // create challenge
  let user = {
    creator_id: "5c49b3a48f57c846b66145fd",
    nickname: "challenger",
    profile_image:
      "https://s3-ap-southeast-2.amazonaws.com/1up.webapp/1549008995079"
  };
  created_challenge = await ChallengeModel.create({
    user: { ...user },
    title: "challenge_title",
    description: "challenge_description",
    video_url:
      "https://s3-ap-southeast-2.amazonaws.com/1up.webapp/1549008995079"
  });
  created_challenge_id = created_challenge._id;
});

afterAll(async () => {
  await ChallengeModel.deleteOne({ title: "challenge_title" });
  await UserModel.deleteOne({ email: "challenge@mail.com" });
  mongoose.connection.close();
});

// ---------------- Create API ----------------

describe("Can create a new challenge", () => {
  //// Manually tested. Not sure how to mock video upload.
  // test("POST /challenges/upload with valid req body", async () => {
  //   const response = await supertest(app)
  //     .post("/challenges/upload")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       title: "Challenge_title",
  //       description: "Challenge_description",
  //       video: `"https://s3-ap-southeast-2.amazonaws.com/1up.webapp/1549008995079"`
  //     });
  //   // .field("title", "Challenge_title")
  //   // .field("description", "Challenge_description")
  //   // .attach("attachment", "./tests/data/test_video.mp4");

  //   expect(200);

  //   const createdChallenge = await ChallengeModel.findOne({
  //     description: "Challenge_description"
  //   });

  //   expect(createdChallenge).toBeTruthy;
  //   expect(createdChallenge.title).toBe("Challenge_title");
  // });

  test("POST /challenges/upload with invalid JWT", async () => {
    const response = await supertest(app)
      .post("/challenges/upload")
      .set("Authorization", `Bearer invalid`);
    expect(401);
  });

  test("POST /challenges/upload without video file", async () => {
    const response = await supertest(app)
      .post("/challenges/upload")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "title",
        description: "description"
      });
    expect(422);
    expect(response.text).toEqual("No video file was selected");
  });
});

// ---------------- Index API ----------------

describe("Get list of challenges", () => {
  test("GET /challenges expect status 200", async () => {
    const response = await supertest(app)
      .get("/challenges")
      .expect(200);
  });

  test("GET /challenges returns an array with values", async () => {
    const response = await supertest(app).get("/challenges");

    const isArray = typeof response.body;
    expect(isArray[0]).toBeTruthy();
  });
});

// ---------------- Destroy API ----------------

describe("Current user can delete their challenge", async () => {
  test("DELETE /challenges/:id with invalid JWT", async () => {
    const response = await supertest(app)
      .delete(`/challenges/${created_challenge_id}`)
      .set("Authorization", `Bearer invalid`);
    expect(401);
  });

  test("DELETE /challenges/:id expect status 200", async () => {
    const response = await supertest(app)
      .delete(`/challenges/${created_challenge_id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(200);

    const deletedChallenge = await ChallengeModel.findById(
      created_challenge_id
    );
    expect(deletedChallenge).toBeNull();
  });
});
