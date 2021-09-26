const genreRouter = require("../routes/genre");
const customerRouter = require("../routes/customer");
const movieRouter = require("../routes/movies");
const rentalRouter = require("../routes/rental");
const userRouter = require("../routes/user");
const authRouter = require("../routes/auth");
const handleError = require("../middleware/error");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genre", genreRouter);
  app.use("/api/customers", customerRouter);
  app.use("/api/movies", movieRouter);
  app.use("/api/rentals", rentalRouter);
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use(handleError);
};
