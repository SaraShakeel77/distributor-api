
const productService = require("../services/product.service");

// GET all products with filters and pagination
const getAllProducts = async (req, res, next) => {
    try {
        const { category, status, page = 1, limit = 20 } = req.query;

        const filters = {
            category,
            status,
            page: Number(page),
            limit: Number(limit),
        };

        const result = await productService.getAllProducts(filters);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// GET product by ID
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await productService.getProductById(id);

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// GET product inventory by ID
const getProductInventory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const inventory = await productService.getProductInventory(id);

        res.status(200).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductInventory,
};
