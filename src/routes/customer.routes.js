
const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customer.controller");
const validate = require("../middleware/validate");
const { customerSchema } = require("../validators/customer.validator");

// Create customer
router.post(
    "/",
    validate(customerSchema),
    customerController.createCustomer
);

// Get all customers
router.get("/", customerController.getAllCustomers);

// Get customer by ID
router.get("/:id", customerController.getCustomerById);

// Update customer
router.put(
    "/:id",
    validate(customerSchema),
    customerController.updateCustomer
);

// Delete customer
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
