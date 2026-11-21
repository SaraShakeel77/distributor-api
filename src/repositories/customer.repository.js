
const pool = require("../config/db");

// Convert PostgreSQL snake_case into API camelCase
const mapCustomer = (row) => {
    if (!row) return null;

    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        company: row.company,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

// Create customer
const create = async (customer) => {
    const query = `
        INSERT INTO customers (name, email, phone, company, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;

    const values = [
        customer.name,
        customer.email,
        customer.phone || null,
        customer.company,
        customer.status || "ACTIVE",
    ];

    const result = await pool.query(query, values);

    return mapCustomer(result.rows[0]);
};

// Get all customers
const findAll = async () => {
    const result =  await pool.query(
        "SELECT * FROM customers ORDER BY created_at DESC"
    );

    return result.rows.map(mapCustomer);
};

// Get customer by ID
const findById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM customers WHERE id = $1",
        [id]
    );

    return mapCustomer(result.rows[0]);
};

// Get customer by email
const findByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM customers WHERE LOWER(email) = LOWER($1)",
        [email]
    );

    return mapCustomer(result.rows[0]);
};

// Update customer
const update = async (id, updatedData) => {
    const query = `
        UPDATE customers
        SET
            name = CASE WHEN $2 THEN $3 ELSE name END,
            email = CASE WHEN $4 THEN $5 ELSE email END,
            phone = CASE WHEN $6 THEN $7 ELSE phone END,
            company = CASE WHEN $8 THEN $9 ELSE company END,
            status = CASE WHEN $10 THEN $11 ELSE status END,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
    `;

    const values = [
        id,

        Object.prototype.hasOwnProperty.call(updatedData, "name"),
        updatedData.name ?? null,

        Object.prototype.hasOwnProperty.call(updatedData, "email"),
        updatedData.email ?? null,

        Object.prototype.hasOwnProperty.call(updatedData, "phone"),
        updatedData.phone ?? null,

        Object.prototype.hasOwnProperty.call(updatedData, "company"),
        updatedData.company ?? null,

        Object.prototype.hasOwnProperty.call(updatedData, "status"),
        updatedData.status ?? null,
    ];

    const result = await pool.query(query, values);

    return mapCustomer(result.rows[0]);
};

// Delete customer
const remove = async (id) => {
    const result = await pool.query(
        "DELETE FROM customers WHERE id = $1 RETURNING id",
        [id]
    );

    return result.rowCount > 0;
};

module.exports = {
    create,
    findAll,
    findById,
    findByEmail,
    update,
    remove,
};
