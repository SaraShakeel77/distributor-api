
const productService = require("../services/product.service");

// GET all products
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
        const product = await productService.getProductById(req.params.id);

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// GET product inventory
const getProductInventory = async (req, res, next) => {
    try {
        const inventory = await productService.getProductInventory(req.params.id);

        res.status(200).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        next(error);
    }
};

// POST create product
const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// PUT update product
const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// PUT update inventory
const updateProductInventory = async (req, res, next) => {
    try {
        const inventory = await productService.updateProductInventory(
            req.params.id,
            req.body
        );

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
    createProduct,
    updateProduct,
    updateProductInventory,
};
