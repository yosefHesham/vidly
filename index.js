const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const genreRouter = require("./routes/genre");
const customerRouter = require("./routes/customer");
const movieRouter = require("./routes/movies");

const app = express();

mongoose.connect("mongodb://localhost/vidly1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use("/api/genre", genreRouter);
app.use("/api/customers", customerRouter);
app.use("/api/movies", movieRouter);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening on ", port));
