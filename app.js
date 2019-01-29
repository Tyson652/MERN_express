const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const passport = require("./config/passport");

app.use(passport.initialize());

// Configuring CORS w/ Dynamic Origin
const whitelist = [
  `${process.env.PROD_FRONT_END_DOMAIN}`,
  `${process.env.FRONT_END_DOMAIN}`
];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

// Enabling CORS Pre-Flight
app.options("*", cors(corsOptions));

// app.use(
//   cors({
//     origin: process.env.PROD_FRONT_END_DOMAIN
//     // origin: process.env.FRONT_END_DOMAIN
//   })
// );

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined"));

app.use(require("./routes"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;
