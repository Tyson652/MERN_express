const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("./config/passport");
const morgan = require("morgan");

var whitelist = [
  `${process.env.FRONT_END_DOMAIN}`,
  `${process.env.PROD_FRONT_END_DOMAIN}`,
  `${process.env.BACK_END_DOMAIN}`
];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(cors(corsOptions));

//**** FOR TESTING ONLY - allow all origins //****
// app.use(cors());
//**** FOR TESTING ONLY - allow all origins //****

app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined"));

app.use(require("./routes"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;
