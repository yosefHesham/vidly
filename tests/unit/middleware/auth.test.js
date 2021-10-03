const { User } = require("../../../models/user_model");
const auth = require("../../../middleware/auth_mid");

describe("auth middleware", () => {
  it("should populate req.user with the payload of the valid web token", () => {
    const token = new User().generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    res = {};
    const next = jest.fn();
    auth(req, res, next);
    expect(req.user).toBeDefined();
  });
});
