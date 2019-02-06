require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(
  // process.env.PROD_DATABASE_URL,   // Production Database
  process.env.DATABASE_URL, // Development Local Database
  { useNewUrlParser: true }
);

mongoose.connection.on("error", err => console.log(err));

mongoose.Promise = global.Promise;

module.exports = mongoose;
