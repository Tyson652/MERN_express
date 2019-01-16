const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(
  cors({
    origin: process.env.FRONT_END_DOMAIN
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined"));

app.use(require("./routes"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;
