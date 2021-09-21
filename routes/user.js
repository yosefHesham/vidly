const userRouter = require("express").Router();
const _ = require("lodash");
const encrypt = require("../hash");
const { User, validateUser } = require("../models/user_model");

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
    res.status(200).send(_.pick(user, ["name", "email", "_id"]));
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = userRouter;
