const supertest = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const HTTPError = require("./../../errors/HTTPError");
const UserModel = require("../../database/models/user_model");

beforeAll(() => {
  global.HTTPError = HTTPError;
  mongoose.connect(
    "mongodb://localhost/1up_api_test",
    { useNewUrlParser: true }
  );
  mongoose.Promise = global.Promise;
  mongoose.connection.on("error", err => console.log(err));
});

afterAll(async () => {
  await UserModel.deleteMany({});
  mongoose.connection.close();
});

const userData = {
  first_name: "Steve2752",
  last_name: "Rogers2752",
  nickname: "srogers2752",
  email: "test2752@mail.com",
  submissions: [
    {
      createdAt: Date.now(),
      challengeId: "5c41363ae878f8938146a876",
      challengeTitle: "Legacy Identity Engineer"
    },
    {
      createdAt: Date.now(),
      challengeId: "8a41363ae878f8938146a812",
      challengeTitle: "Ancient Identity Artist"
    }
  ]
};

// TODO - route required??? available from req.user
// describe("Get current user's details", () => {
// test("GET /profile", async () => {
//   const newUser = await UserModel.create(userData);
//   const response = await supertest(app)
//     .get("/profile")
//     .expect(200);
//   expect(response.body.first_name).toBe("Steve2752");
// });
// });

describe("Get an other user's details", () => {
  test("GET /profile/:id", async () => {
    const newUser = await UserModel.create(userData);

    const response = await supertest(app)
      .get(`/profile/${newUser._id}`)
      .expect(200);

    expect(response.body.first_name).toBe("Steve2752");
  });
});

// TODO
describe("Update current user's details", () => {
  // test("PUT /profile", async () => {
  //   const newUser = await UserModel.create(userData);
  //   const response = await supertest(app)
  //     .get("/profile")
  //     .expect(200);
  //   expect(response.body.first_name).toBe("Steve2752");
  // });
});
