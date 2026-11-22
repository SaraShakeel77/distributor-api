
const productRepository = require("../repositories/product.repository");
const AppError = require("../Errors/AppError");

// Get all products
const getAllProducts = async (filters) => {
    return await productRepository.findAll(filters);
};

// Get product by ID
const getProductById = async (id) => {
    const product = await productRepository.findById(id);

    if (!product) {
        throw new AppError(
            "Product not found",
            404,
            "PRODUCT_NOT_FOUND"
        );
    }

    return product;
};

// Get product inventory by ID
const getProductInventory = async (id) => {
    const inventory = await productRepository.findInventoryByProductId(id);

    if (inventory.length === 0) {
        throw new AppError(
            "Product inventory not found",
            404,
            "INVENTORY_NOT_FOUND"
        );
    }

    return inventory;
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductInventory,
};
