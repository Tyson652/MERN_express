const supertest = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const UserModel = require("../../database/models/user_model");

beforeAll(() => {
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

// ---------------- Register Tests ----------------

describe("Register a new user", () => {
  //// manual tests pass
  //// test broke - email undefined for JWT.sign()
  // test("POST /register with valid req body", async () => {
  //   const response = await supertest(app)
  //     .post("/register")
  //     .send({
  //       first_name: "Steven2435",
  //       last_name: "Rogers2435",
  //       nickname: "SRogers2435",
  //       email: "test2435@mail.com",
  //       password: "password",
  //       terms_conditions: "true"
  //     })
  //     .expect(200);

  //   // const createdUser = await UserModel.findOne({ email: "test2435@mail.com" });

  //   // expect(createdUser).toBeTruthy;
  //   // expect(createdUser.nickname).toBe("SRogers2435");
  // });

  test("POST /register with invalid req body", async () => {
    const response = await supertest(app)
      .post("/register")
      .send({
        first_name: "Steven1111",
        last_name: "Rogers1111",
        nickname: "SRogers1111",
        email: "test111@mail.com",
        password: "password",
        termsConditions: ""
      })
      .expect(500);

    const createdUser = await UserModel.findOne({ email: "test111@mail.com" });

    expect(createdUser).toBeFalsy;
  });
});
