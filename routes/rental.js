const router = require("express").Router();
const { Rental, validateRental } = require("../models/rental_model");
const { Movie } = require("../models/movie_model");
const { Customer } = require("../models/customer_model");
const Fawn = require("fawn/lib/fawn");

Fawn.init("mongodb://localhost/vidly1");

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }
  console.log(req.body.movieId);
  const movie = await Movie.findById(req.body.movieId).select(
    "_id title numberInStock dailyRentalRate"
  );
  console.log(`number of movies ${movie.numberInStock}`);
  const customer = await Customer.findById(req.body.customerId).select(
    "_id name isGold phone"
  );
  if (!movie) {
    res.status(404).send("movie with given id not found");
    return;
  }
  if (movie.numberInStock === 0) {
    res.status(404).send("movieis not available at the moment");
    return;
  }
  if (!customer) {
    res.status(404).send("customer with given id not found");
    return;
  }
  try {
    let rental = new Rental({
      customer: customer,
      movie: { title: movie.title, dailyRentalRate: movie.dailyRentalRate },
    });

    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.status(200).send(rental);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
  } catch (ex) {
    res.send(ex.message);
  }
});

module.exports = router;
