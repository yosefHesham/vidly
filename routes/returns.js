const express = require("express");
const { Rental } = require("../models/rental_model");
const router = express.Router();
const moment = require("moment");
const { Movie } = require("../models/movie_model");
const auth = require("../middleware/auth_mid");
router.post("/", auth, async (req, res) => {
  if (!req.body.customerId || !req.body.movieId) {
    return res.status(400).send("invalid ids");
  }
  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) {
    return res.status(404).send("not found");
  }
  if (rental.dateReturned) {
    return res.status(400).send("rental is already processed");
  }
  rental.dateReturned = new Date();
  rental.rentalFee =
    moment().diff(rental.datOut, "days") * rental.movie.dailyRentalRate;
  await rental.save();
  const movie = await Movie.findById(rental.movieId);
  movie.numberInStock++;
  await movie.save();
  return res.status(200).send(rental);

  //   res.status(401).send("unauthorized");
});

module.exports = router;
