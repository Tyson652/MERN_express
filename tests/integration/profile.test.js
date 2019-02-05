require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const HTTPError = require("./../../errors/HTTPError");
const UserModel = require("../../database/models/user_model");
const JWTService = require("./../../services/jwt_service");

let token = undefined;
let userProfileId = undefined;

beforeAll(async () => {
  global.HTTPError = HTTPError;
  mongoose.connect("mongodb://localhost/1up_api_test", {
    useNewUrlParser: true
  });
  mongoose.Promise = global.Promise;
  mongoose.connection.on("error", err => console.log(err));

  userProfile = new UserModel({
    first_name: "first_profile",
    last_name: "last_profile",
    nickname: "nick_profile",
    email: "profileUser@mail.com"
  });
  await userProfile.setPassword("password");
  await userProfile.save();
  token = JWTService.generateToken(userProfile);
  userProfileId = userProfile._id;
});

afterAll(async () => {
  await UserModel.deleteOne({ email: "profileUser@mail.com" });
  mongoose.connection.close();
});

// ---------------- Show Current User API ----------------

describe("Get current user's details", () => {
  test("GET /profile", async () => {
    const response = await supertest(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(200);
    expect(response.body.first_name).toBe("first_profile");
  });
});

// ---------------- Show Another User API ----------------

describe("Get an other user's details", () => {
  test(`GET /profile/:id`, async () => {
    const response = await supertest(app).get(`/profile/${userProfileId}`);
    expect(200);

    expect(response.body.last_name).toBe("last_profile");
  });
});

// ---------------- Update Current User API ----------------

describe("Update current user's details", () => {
  test("PUT /profile", async () => {
    const response = await supertest(app)
      .put("/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "newFirst"
      });
    expect(200);
    expect(response.body.first_name).toBe("newFirst");
    expect(response.body.last_name).toBe("last_profile");
  });
});
