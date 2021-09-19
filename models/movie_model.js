const Joi = require("joi");
const objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { genreSchema } = require("./genre_model");
const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: genreSchema,
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    require: true,
  },
});
const Movie = mongoose.model("movies", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().required(),
    genre: { _id: objectId(), name: Joi.string().required() },
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0),
  });
  const result = schema.validate(movie);
  return result;
}
exports.Movie = Movie;
exports.validateMovie = validateMovie;
