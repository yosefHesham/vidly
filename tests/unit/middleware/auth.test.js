const { User } = require("../../../models/user_model");
const auth = require("../../../middleware/auth_mid");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with the payload of the valid web token", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    res = {};
    const next = jest.fn();
    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
