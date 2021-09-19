const router = require("express").Router();
const { validateCustomer, Customer } = require("../models/customer_model");

router.post("/", async (req, res) => {
  const error = validateCustomer(req.body);
  console.log(error);
  if (error) {
    res.status(400).send(error);
    return;
  }

  try {
    let customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });
    customer = await customer.save();
    res.status(200).send(customer);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/", async (req, res) => {
  const customers = await getAllCustomers();
  res.status(400).send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404).send("customer not found");
    return;
  }
  res.status(200).send(customer);
});

router.put("/:id", async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404).send("customer not found");
    return;
  }
  try {
    customer.name = req.body.name;
    customer.phone = req.body.phone;
    customer.isGold = req.body.isGold;
    customer = await customer.save();
    res.status(200).send(customer);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let customer = await Customer.findByIdAndRemove(req.params.id);
    res.status(200).send(`Deleted Successfully! ${customer}`);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

async function getAllCustomers() {
  const customers = await Customer.find().sort("name");
  if (!customers || customers.length == 0) {
    return "No customers found";
  }
  return customers;
}
module.exports = router;
