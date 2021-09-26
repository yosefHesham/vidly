const mongoose = require("mongoose");

module.exports = function () {
  mongoose.connect("mongodb://localhost/vidly1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
