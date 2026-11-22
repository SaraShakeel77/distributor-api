
const pool = require("../config/db");

// Convert PostgreSQL snake_case into API camelCase
const mapProduct = (row) => {
    if (!row) return null;

    return {
        id: row.id,
        sku: row.sku,
        name: row.name,
        category: row.category,
        price: row.price, // NUMERIC returned as string
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

// Get all products with optional filters and pagination
const findAll = async ({ category, status, page = 1, limit = 20 }) => {
    const conditions = [];
    const values = [];

    // Add category filter if provided
    if (category) {
        values.push(category);
        conditions.push(`category = $${values.length}`);
    }

    // Add status filter if provided
    if (status !== undefined) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // Get total matching products
    const countQuery = `
        SELECT COUNT(*) 
        FROM products
        ${whereClause}
    `;

    const countResult = await pool.query(countQuery, values);

    const totalItems = Number(countResult.rows[0].count);

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Add LIMIT and OFFSET parameters
    const paginationValues = [...values, limit, offset];

    const productsQuery = `
        SELECT *
        FROM products
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

    const productsResult = await pool.query(
        productsQuery,
        paginationValues
    );

    return {
        data: productsResult.rows.map(mapProduct),
        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
        },
    };
};

// Get product by ID
const findById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );

    return mapProduct(result.rows[0]);
};


// Get product inventory by ID
const findInventoryByProductId = async (productId) => {
    console.log("STEP 1 - Product ID:", productId);

    const result = await pool.query(
        `SELECT
            id,
            product_id,
            warehouse,
            available_quantity,
            reserved_quantity,
            updated_at
        FROM inventory
        WHERE product_id = $1
        ORDER BY warehouse ASC`,
        [productId]
    );

    console.log("STEP 2 - Database rows:", result.rows);

    const inventory = result.rows.map((row) => ({
        id: row.id,
        productId: row.product_id,
        warehouse: row.warehouse,
        availableQuantity: row.available_quantity,
        reservedQuantity: row.reserved_quantity,
        updatedAt: row.updated_at,
    }));

    console.log("STEP 3 - Mapped inventory:", inventory);

    return inventory;
};
module.exports = {
    findAll,
    findById,
    findInventoryByProductId,
};
