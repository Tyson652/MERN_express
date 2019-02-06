require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const HTTPError = require("./../../errors/HTTPError");
const JWTService = require("./../../services/jwt_service");
const UserModel = require("../../database/models/user_model");

let token = undefined;

beforeAll(async () => {
  global.HTTPError = HTTPError;
  mongoose.connect("mongodb://localhost/1up_api_test", {
    useNewUrlParser: true
  });
  mongoose.Promise = global.Promise;
  mongoose.connection.on("error", err => console.log(err));

  userAuth = new UserModel({
    first_name: "first_admin",
    last_name: "last_admin",
    nickname: "nick_admin",
    email: "changePasswordUser@mail.com"
  });
  await userAuth.setPassword("password");
  await userAuth.save();
  token = JWTService.generateToken(userAuth);
});

afterAll(async () => {
  await UserModel.deleteOne({ email: "auth@mail.com" });
  await UserModel.deleteOne({ email: "changePasswordUser@mail.com" });
  mongoose.connection.close();
});

// ---------------- Register API ----------------

describe("Register a new user", () => {
  test("POST /register with valid req body", async () => {
    const response = await supertest(app)
      .post("/register")
      .send({
        first_name: "firstAuth",
        last_name: "lastAuth",
        nickname: "nickAuth",
        email: "auth@mail.com",
        password: "password",
        terms_conditions: "true"
      })
      .expect(200);

    const createdUser = await UserModel.findOne({ email: "auth@mail.com" });

    expect(createdUser).toBeTruthy;
    expect(createdUser.nickname).toBe("nickAuth");
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

// ---------------- Login API ----------------

describe("Login an existing user", () => {
  test("POST /login with valid email and password", async () => {
    const response = await supertest(app)
      .post("/login")
      .send({
        email: "auth@mail.com",
        password: "password"
      });
    expect(200);
    expect(response.body.token).toBeTruthy();
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

// ---------------- Change Password API ----------------

describe("Existing user can change password", () => {
  test("PUT /changepassword with valid body", async () => {
    const response = await supertest(app)
      .put("/changepassword")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "password",
        new_password: "newPassword"
      });
    expect(200);

    const updatedPassword = await supertest(app)
      .post("/login")
      .send({
        email: "changePasswordUser@mail.com",
        password: "newPassword"
      });
    expect(200);
    expect(updatedPassword.body.token).toBeTruthy();
  });

  test("PUT /login with invalid password", async () => {
    const response = await supertest(app)
      .put("/changepassword")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "invalid",
        new_password: "invalid"
      });
    expect(401);
    expect(response.text).toEqual("Password incorrect");
  });
});
