require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true }
);

mongoose.connection.on("error", err => console.log(err));

mongoose.Promise = global.Promise;

module.exports = mongoose;
