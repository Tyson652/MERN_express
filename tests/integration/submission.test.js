const supertest = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const ChallengeModel = require("../../database/models/challenge_model");

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

const testChallenge = {
  title: "100M sprint against your buddy",
  description: "Fast is slow, and slow is fast456",
  video: "A21ak4SDtVe",
  expiry_date: 1550207399430
};

let newChallenge = "";

// ---------------- Create Tests ----------------

describe("Create a submission", () => {
  test("POST /challenges/:id/submissions with valid req body", async () => {
    newChallenge = await ChallengeModel.create(testChallenge);

    const response = await supertest(app)
      .post(`/challenges/${newChallenge._id}/submissions`)
      .send({
        title: "100M test submission success",
        description: "100M test description",
        video: "dfaf4dshshs"
      })
      .expect(200);

    const newSubmission = await ChallengeModel.findOne({
      "submissions.title": "100M test submission success"
    });

    expect(newSubmission).toBeTruthy;
  });

  test("POST /challenges/:id/submissions missing params", async () => {
    const response = await supertest(app)
      .post(`/challenges/${newChallenge._id}/submissions`)
      .send({ title: "100M test submission-invalid" })
      .expect(500);
  });
});
