const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const passwordComplexity = require("joi-password-complexity");

const { string } = require("joi");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: Boolean,
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("users", userSchema);

function validateUser(user) {
  const error = passwordComplexity(undefined, "Password").validate(
    user.password
  );
  if (error) {
    return error;
  }
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(user);
  return result;
}

exports.User = User;
exports.validateUser = validateUser;
