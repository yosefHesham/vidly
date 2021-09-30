const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  mongoose.connect(config.get("db"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`connected to db at ${config.get("db")}`);
};
