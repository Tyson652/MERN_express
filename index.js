require("dotenv").config();
require("./config/database");
const app = require("./app");
const HTTPError = require("./errors/HTTPError");

global.HTTPError = HTTPError;

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
