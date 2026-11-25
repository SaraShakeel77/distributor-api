
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

// Get product inventory
const getProductInventory = async (id) => {
    await getProductById(id);

    const inventory = await productRepository.findInventoryByProductId(id);

    return inventory;
};

// Create product
const createProduct = async (productData) => {
    return await productRepository.create(productData);
};

// Update product
const updateProduct = async (id, productData) => {
    await getProductById(id);

    const updatedProduct = await productRepository.update(id, productData);

    return updatedProduct;
};

// Update product inventory
const updateProductInventory = async (id, inventoryData) => {
    await getProductById(id);

    const updatedInventory = await productRepository.updateInventory(
        id,
        inventoryData
    );

    if (!updatedInventory) {
        throw new AppError(
            "Product inventory not found for this warehouse",
            404,
            "INVENTORY_NOT_FOUND"
        );
    }

    return updatedInventory;
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductInventory,
    createProduct,
    updateProduct,
    updateProductInventory
};
