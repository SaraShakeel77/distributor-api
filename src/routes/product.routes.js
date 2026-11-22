
const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const validate = require("../middleware/validate");
const { productQuerySchema } = require("../validators/product.validator");

// Get all products with filters and pagination
router.get(
    "/",
    validate(productQuerySchema, "query"),
    productController.getAllProducts
);

// Get product inventory by ID
router.get(
    "/:id/inventory",
    productController.getProductInventory
);
// Get product by ID
router.get("/:id", productController.getProductById);

module.exports = router;
