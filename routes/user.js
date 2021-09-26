const userRouter = require("express").Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const encrypt = require("../hash");
const { User, validateUser } = require("../models/user_model");
const router = require("./genre");
const auth = require("../middleware/auth_mid");

userRouter.get("/me", auth, async function (req, res) {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

userRouter.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  try {
    let user = new User(_.pick(req.body, ["name", "email", "password"]));
    user.password = await encrypt(user.password);
    user = await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["name", "email", "_id"]));
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = userRouter;
