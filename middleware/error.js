const winston = require("winston");

module.exports = function handleError(err, req, res, next) {
  winston.error(err.message, err);
  res.status(500).send("something failed");
};
