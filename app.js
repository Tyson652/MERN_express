const express = require("express");
const app = express();
const passport = require("./config/passport");
const cors = require("cors");
const morgan = require("morgan");

app.use(passport.initialize());

app.use(
  cors({
    // origin: process.env.FRONT_END_DOMAIN
    origin: process.env.PROD_FRONT_END_DOMAIN
  })
);

// app.use(function(req, res, next) {
//   // Instead of "*" you should enable only specific origins
//   res.header("Access-Control-Allow-Origin", "*");
//   // FIXME: URL locked by CORS policy: Response to preflight request doesn't pass access control check
//   // res.header("Access-Control-Allow-Origin", `${process.env.PROD_FRONT_END_DOMAIN}`);
//   // Supported HTTP verbs
//   res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
//   // Other custom headers
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Authorization, Content-Length, Content-Type, Accept"
//   );
//   next();
// });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined"));

app.use(require("./routes"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;
