const express = require("express");
const { validateGenre, Genre } = require("../models/genre_model");
const router = express.Router();

async function getGenres() {
  const genres = await Genre.find();
  return genres;
}
router.get("/", async (req, res) => {
  const genres = await getGenres();
  if (!genres || genres.length == 0) {
    res.status(400).send("No Genres found");
    return;
  }
  res.status(200).send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404).send("Not found");
    return;
  }
  res.status(200).send(genre);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }
  try {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.status(200).send(genre);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404).send("Not found");
    return;
  }
  const result = await Genre.findByIdAndDelete(req.params.id);
  res.status(200).send(result);
});

router.put("/:id", async (req, res) => {
  let genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404).send("Not found");
    return;
  }
  genre.name = req.body.name;
  genre = await genre.save();
  res.status(200).send(genre);
});

module.exports = router;
