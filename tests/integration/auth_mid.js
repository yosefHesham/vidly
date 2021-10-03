const request = require("supertest");
const { User } = require("../../models/user_model");
describe("auth middlewares", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
  });
  let token;
  const exec = () => {
    return request(server)
      .post("/api/genre")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  it("should return 401 if token is not provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is not valid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 200 if token is  valid", async () => {
    token = token;
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
