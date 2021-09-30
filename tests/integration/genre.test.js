const request = require("supertest");
const { describe, it, expect } = require("@jest/globals");
const { Genre } = require("../../models/genre_model");
const { User } = require("../../models/user_model");
let server;
describe("/api/genre", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.remove({});
    server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const genres = await Genre.collection.insertMany([
        { name: "action" },
        { name: "drama" },
      ]);

      const rest = await request(server).get("/api/genre");

      expect(rest.status).toBe(200);
      expect(rest.body.length).toBeGreaterThan(0);
      expect(rest.body.some((g) => g.name == "drama")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre with given id", async () => {
      const genre = new Genre({ name: "thrill" });
      await genre.save();

      const res = await request(server).get(`/api/genre/${genre._id}`);
      expect(res.status).toBe(200);
      console.log(genre._id);
      console.log(res.body._id);
      expect(res.body._id === genre._id.toHexString()).toBeTruthy();
    });

    it("should return 404 if its not found", async () => {
      const res = await request(server).get("/api/genre/1");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return 401 if client  not authorized", async () => {
      const res = await request(server)
        .post("/api/genre/")
        .send({ name: "genre1" });
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre  is less than 5 char", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genre/")
        .set("x-auth-token", token)
        .send({ name: "123" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre  is more than 50 char", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genre/")
        .set("x-auth-token", token)
        .send({
          name: "1234567890123456789012345678901234567890123456789012345678901234567890",
        });
      expect(res.status).toBe(400);
    });
    it("should return 200 if genre saved to db ", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genre/")
        .set("x-auth-token", token)
        .send({
          name: "genre1",
        });
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return 200 if genre saved to db ", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/genre/")
        .set("x-auth-token", token)
        .send({
          name: "genre1",
        });
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  // describe("POST /", () => {
  //   it("should add genre to the db", async () => {
  //     await request(server).post("/api/genre");
  //   });
  // });
});
