
const pool = require("../config/db");

// Convert PostgreSQL snake_case into API camelCase
const mapProduct = (row) => {
    if (!row) return null;

    return {
        id: row.id,
        sku: row.sku,
        name: row.name,
        description: row.description,
        category: row.category,
        price: row.price,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

// Map inventory response
const mapInventory = (row) => {
    if (!row) return null;

    return {
        id: row.id,
        productId: row.product_id,
        warehouse: row.warehouse,
        availableQuantity: row.available_quantity,
        reservedQuantity: row.reserved_quantity,
        updatedAt: row.updated_at,
    };
};

// Get all products with filters and pagination
const findAll = async ({ category, status, page = 1, limit = 20 }) => {
    const conditions = [];
    const values = [];

    if (category) {
        values.push(category);
        conditions.push(`category = $${values.length}`);
    }

    if (status !== undefined) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const countQuery = `
        SELECT COUNT(*)
        FROM products
        ${whereClause}
    `;

    const countResult = await pool.query(countQuery, values);
    const totalItems = Number(countResult.rows[0].count);

    const offset = (page - 1) * limit;
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
    const result = await pool.query(
        `SELECT *
         FROM inventory
         WHERE product_id = $1
         ORDER BY warehouse ASC`,
        [productId]
    );

    return result.rows.map(mapInventory);
};

// Create product
const create = async (productData) => {
    const {
        name,
        sku,
        description,
        category,
        price,
        status
    } = productData;

    const result = await pool.query(
        `INSERT INTO products
            (name, sku, description, category, price, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
            name,
            sku,
            description ?? null,
            category ?? null,
            price,
            status ?? "ACTIVE"
        ]
    );

    return mapProduct(result.rows[0]);
};

// Update product
const update = async (id, productData) => {
    const allowedFields = {
        name: "name",
        sku: "sku",
        description: "description",
        category: "category",
        price: "price",
        status: "status"
    };

    const updates = [];
    const values = [];

    for (const [field, column] of Object.entries(allowedFields)) {
        if (productData[field] !== undefined) {
            values.push(productData[field]);
            updates.push(`${column} = $${values.length}`);
        }
    }

    if (updates.length === 0) {
        return null;
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    const result = await pool.query(
        `UPDATE products
         SET ${updates.join(", ")}
         WHERE id = $${values.length}
         RETURNING *`,
        values
    );

    return mapProduct(result.rows[0]);
};

// Update inventory for a specific warehouse
const updateInventory = async (productId, inventoryData) => {
    const {
        warehouse,
        availableQuantity,
        reservedQuantity
    } = inventoryData;

    const updates = [];
    const values = [productId, warehouse];

    if (availableQuantity !== undefined) {
        values.push(availableQuantity);
        updates.push(`available_quantity = $${values.length}`);
    }

    if (reservedQuantity !== undefined) {
        values.push(reservedQuantity);
        updates.push(`reserved_quantity = $${values.length}`);
    }

    if (updates.length === 0) {
        return null;
    }

    updates.push("updated_at = NOW()");

    const result = await pool.query(
        `UPDATE inventory
         SET ${updates.join(", ")}
         WHERE product_id = $1
         AND warehouse = $2
         RETURNING *`,
        values
    );

    return mapInventory(result.rows[0]);
};

module.exports = {
    findAll,
    findById,
    findInventoryByProductId,
    create,
    update,
    updateInventory
};
