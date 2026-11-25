
const pool = require("../config/db");

// Create a new user
const create = async (user) => {
    const query = `
        INSERT INTO users (email, password_hash, role, customer_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, password_hash, role, customer_id,
                  created_at, updated_at
    `;

    const values = [
        user.email,
        user.passwordHash,
        user.role,
        user.customerId || null,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

// Find user by email
const findByEmail = async (email) => {
    const result = await pool.query(
        `SELECT id, email, password_hash, role, customer_id,
                created_at, updated_at
         FROM users
         WHERE LOWER(email) = LOWER($1)`,
        [email]
    );

    return result.rows[0] || null;
};

// Find user by ID
const findById = async (id) => {
    const result = await pool.query(
        `SELECT id, email, role, customer_id,
                created_at, updated_at
         FROM users
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

module.exports = {
    create,
    findByEmail,
    findById,
};

