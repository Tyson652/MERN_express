const supertest = require("supertest");
const app = require("./../../../app");
const mongoose = require("mongoose");
const ChallengeModel = require("./../../../database/models/challenge_model");

beforeAll(() => {
  mongoose.connect(
    "mongodb://localhost/1up_api_test",
    { useNewUrlParser: true }
  );
  mongoose.Promise = global.Promise;
  mongoose.connection.on("error", err => console.log(err));
});

afterAll(async () => {
  await ChallengeModel.deleteMany({});
  mongoose.connection.close();
});

describe("Create a challenge", () => {
  test("POST /challenges with valid req body", async () => {
    const response = await supertest(app)
      .post("/challenges")
      .send({
        title: "ALS Ice Bucket",
        description: "Brr... dump a bucket of ice water on your head",
        video: "DepakUSDtQE",
        expiry_date: 1550207394430
      })
      .expect(200);

    const createdChallenge = await ChallengeModel.findOne({
      description: "Brr... dump a bucket of ice water on your head"
    });

    expect(createdChallenge).toBeTruthy;
    expect(createdChallenge.title).toBe("ALS Ice Bucket");
  });

  test("POST /challenges with invalid req body", async () => {
    const response = await supertest(app)
      .post("/challenges")
      .send({
        title: "ALS Ice Bucket",
        description: "Failed tests... dump a bucket of ice water on your head",
        video: 1,
        expiry_date: 1
      })
      .expect(500);

    const createdChallenge = await ChallengeModel.findOne({
      description: "Failed tests... dump a bucket of ice water on your head"
    });

    expect(createdChallenge).toBeFalsy;
  });
});
