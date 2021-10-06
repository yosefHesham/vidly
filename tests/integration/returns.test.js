const request = require("supertest");
const { describe, it, expect } = require("@jest/globals");
const { Rental } = require("../../models/rental_model");
const { User } = require("../../models/user_model");
const mongoose = require("mongoose");
const { Movie } = require("../../models/movie_model");
const moment = require("moment");

describe("POST /api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    movie = new Movie({
      _id: movieId,
      dailyRentalRate: 2,
      title: "lord of the rings",
      genre: { name: "anything" },
      numberInStock: 10,
    });
    await movie.save();
    rental = new Rental({
      customer: {
        name: "yosefheshsam",
        phone: "123456",
        _id: customerId,
      },
      movie: {
        title: "lord of the rings",
        _id: movieId,
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it("it should return 401 if client is not logged in ", async () => {
    token = "";
    const result = await exec();
    expect(result.status).toBe(401);
  });
  it("it should return 401 if customer id is not provided", async () => {
    customerId = "";
    const result = await exec();
    expect(result.status).toBe(400);
  });
  it("it should return 401 if movie id is not provided", async () => {
    movieId = "";
    const result = await exec();

    expect(result.status).toBe(400);
  });

  it("it should return 404 if no rental is found", async () => {
    await Rental.remove({});
    const result = await exec();

    expect(result.status).toBe(404);
  });

  it("it should return 400 if rental is processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const result = await exec();
    expect(result.status).toBe(400);
  });

  it("it should return 200 if rental is done", async () => {
    const result = await exec();
    expect(result.status).toBe(200);
  });
  it("it should set valid date if input is valid", async () => {
    const result = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * diff);
  });
  it("it should set valid date if input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const result = await exec();
    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("it should increase movie in stock", async () => {
    const result = await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movieInDb.numberInStock + 1);
  });
  it("should return the rental in the response", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(res.body).toMatchObject(rentalInDb);
  });
});
