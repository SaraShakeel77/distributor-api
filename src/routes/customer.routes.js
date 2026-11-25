
const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customer.controller");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const { customerSchema } = require("../validators/customer.validator");


router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(customerSchema),
    customerController.createCustomer
);


router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    customerController.getAllCustomers
);


router.get(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    customerController.getCustomerById
);


router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(customerSchema),
    customerController.updateCustomer
);


router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    customerController.deleteCustomer
);

module.exports = router;
