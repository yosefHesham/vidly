const express = require("express");
const morgan = require("morgan");
const winston = require("winston");
const app = express();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening on ", port));
