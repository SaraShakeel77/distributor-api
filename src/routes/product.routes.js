
const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");

const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
    productQuerySchema,
    createProductSchema,
    updateProductSchema,
    updateInventorySchema
} = require("../validators/product.validator");

// GET all products
// ADMIN and DISTRIBUTOR
router.get(
    "/",
    authenticate,
    authorize("ADMIN", "DISTRIBUTOR"),
    validate(productQuerySchema, "query"),
    productController.getAllProducts
);

// GET product inventory
// ADMIN and DISTRIBUTOR
router.get(
    "/:id/inventory",
    authenticate,
    authorize("ADMIN", "DISTRIBUTOR"),
    productController.getProductInventory
);

// UPDATE product inventory
// ADMIN only
router.put(
    "/:id/inventory",
    authenticate,
    authorize("ADMIN"),
    validate(updateInventorySchema),
    productController.updateProductInventory
);

// CREATE product
// ADMIN only
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(createProductSchema),
    productController.createProduct
);

// UPDATE product
// ADMIN only
router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(updateProductSchema),
    productController.updateProduct
);

// GET product by ID
// ADMIN and DISTRIBUTOR
router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "DISTRIBUTOR"),
    productController.getProductById
);

module.exports = router;
