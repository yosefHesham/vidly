const exp = require("constants");
const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Genre = mongoose.model("genre", genreSchema);

function validateGenre(genreName) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  const result = schema.validate(genreName);
  return result;
}
exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;
