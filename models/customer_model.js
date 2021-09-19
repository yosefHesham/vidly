const mongoose = require("mongoose");
const Joi = require("joi");
const { string } = require("joi");

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});

const Customer = mongoose.model("customers", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().min(3).required(),
    isGold: Joi.bool().required(),
  });
  const result = schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
