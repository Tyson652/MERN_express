const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const passport = require("./config/passport");

app.use(passport.initialize());

// // Configuring CORS w/ Dynamic Origin
// const whitelist = [
//   `${process.env.PROD_FRONT_END_DOMAIN}`,
//   `${process.env.FRONT_END_DOMAIN}`
// ];
// const corsOptions = {
//   origin: function(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   }
// };

// app.use(cors(corsOptions));

app.use(function(req, res, next) {
  // res.header(
  //   "Access-Control-Allow-Origin",
  //   `${process.env.PROD_FRONT_END_DOMAIN}`
  // );
  // Instead of "*" you should enable only specific origins
  res.header("Access-Control-Allow-Origin", "*");
  // Supported HTTP verbs
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  // Other custom headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Authorization, Content-Length, Content-Type, Accept"
  );
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined"));

app.use(require("./routes"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;
