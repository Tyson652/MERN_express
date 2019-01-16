require("dotenv").config();
const mongoose = require("./../config/database");
const ChallengeModel = require("./models/challenge_model");
const UserModel = require("./models/user_model");
const faker = require("faker");

const challengePromises = [];
for(let i = 0; i < 10; i++) {
  console.log(`Creating challenge ${i + 1}`);
  challengePromises.push(ChallengeModel.create({
      title: faker.name.title(),
      description: faker.lorem.paragraph(),
      video: faker.commerce.productName(),
      expiryDate: faker.date.recent()
  }));
}

const userPromises = [];
for(let i = 0; i < 10; i++) {
  console.log(`Creating challenge ${i + 1}`);
  userPromises.push(UserModel.create({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      nickname: faker.name.firstName(),
      is_verified: "false",
      profile_image: faker.image.avatar(),
      gender: "male",
      age: "25",
      location: faker.address.city(),
      is_admin: "false"
  }));
}

Promise.all(userPromises, challengePromises)
    .then(challenges => {
        console.log(`Seeds file successful, created ${challenges.length} products`);
    })
    .catch(err => console.log(`Seeds file had an error: ${err}`))
    .finally(() => mongoose.disconnect());