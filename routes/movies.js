const router = require("express").Router();
const { Genre } = require("../models/genre_model");
const { validateMovie, Movie } = require("../models/movie_model");

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  try {
    // const genre = await Genre.findById(req.body.genre);
    // if (!genre) {
    //   res.status(404).send("no genres with this id");
    //   return;
    // }
    let movie = new Movie({
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: req.body.genre,
    });
    movie = await movie.save();
    res.status(200).send(movie);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const movies = await getAllMovies();
    res.status(200).send(movies);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404).send("not found");
    return;
  }
  res.status(200).send(movie);
});

router.put("/:id", async (req, res) => {
  let movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(400).send("Movie not found");
    return;
  }
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }
  try {
    movie.title = req.body.title;
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;
    movie.genre = req.body.genre;
    movie = await movie.save();
    res.status(200).send(movie);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) {
    res.status(404).send("not found");
    return;
  }
  res.status(200).send(movie);
});

async function getAllMovies() {
  const movies = await Movie.find().sort("name");
  if (!movies || movies.length == 0) {
    return "No customers found";
  }
  return movies;
}

module.exports = router;
