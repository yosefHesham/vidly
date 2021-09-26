const authRouter = require("express").Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const passwordComplexity = require("joi-password-complexity");
const { User } = require("../models/user_model");

authRouter.post("/", async function (req, res) {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.message);
    return;
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("wrong password or email !");
      return;
    }
    const isEqual = await bcrypt.compare(req.body.password, user.password);
    if (!isEqual) {
      res.status(400).send("wrong password or email !");
      return;
    }
    const token = user.generateAuthToken();
    res.status(200).send(token);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

function validateUser(user) {
  const error = passwordComplexity(undefined, "Password").validate(
    user.password
  );
  if (error) {
    return error;
  }
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(user);
  return result;
}
module.exports = authRouter;
