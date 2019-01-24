require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
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
  await UserModel.deleteOne({ email: "auth@mail.com" });
  mongoose.connection.close();
});

// ---------------- Register Tests ----------------

describe("Register a new user", () => {
  test("POST /register with valid req body", async () => {
    const response = await supertest(app)
      .post("/register")
      .send({
        first_name: "first_auth",
        last_name: "last_auth",
        nickname: "nick_auth",
        email: "auth@mail.com",
        password: "password",
        terms_conditions: "true"
      })
      .expect(200);

    const createdUser = await UserModel.findOne({ email: "auth@mail.com" });

    expect(createdUser).toBeTruthy;
    expect(createdUser.nickname).toBe("nick_auth");
  });

  test("POST /register with invalid req body", async () => {
    const response = await supertest(app)
      .post("/register")
      .send({
        first_name: "",
        last_name: "",
        nickname: "",
        email: "auth@mail.",
        password: "",
        terms_conditions: ""
      })
      .expect(500);

    const createdUser = await UserModel.findOne({ email: "auth@mail.com" });
    expect(createdUser).toBeFalsy;
  });
});

// ---------------- Login Tests ----------------

describe("Login an existing user", () => {
  test("POST /login with valid email and password", async () => {
    const response = await supertest(app)
      .post("/login")
      .send({
        email: "auth@mail.com",
        password: "password"
      })
      .expect(200);

    const createdUser = await UserModel.findOne({ email: "auth@mail.com" });

    expect(createdUser).toBeTruthy;
    expect(createdUser.nickname).toBe("nick_auth");
  });

  test("POST /login with invalid email and password", async () => {
    const response = await supertest(app)
      .post("/login")
      .send({
        email: "invalid@mail.com",
        password: "invalid"
      })
      .expect(401);

    const createdUser = await UserModel.findOne({ email: "auth@mail.com" });
    expect(createdUser).toBeFalsy;
  });
});
