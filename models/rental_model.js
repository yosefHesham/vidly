const mongoose = require("mongoose");
const Joi = require("joi");
const objectId = require("joi-objectid")(Joi);

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      isGold: {
        type: Boolean,
        required: true,
      },
      phone: {
        type: String,
        trim: true,
        required: true,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255,
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
    required: true,
    default: Date.now,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("rentals", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: objectId(),
    movieId: objectId(),
  });
  const result = schema.validate(rental);
  return result;
}

exports.Rental = Rental;
exports.validateRental = validateRental;
