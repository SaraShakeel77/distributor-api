require("dotenv").config();

const pool = require("./src/config/db");

async function checkTables() {
    try {
        const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.table(result.rows);

        const customers = await pool.query(
            "SELECT COUNT(*) FROM customers"
        );

        console.log("Saved customers:", customers.rows[0].count);

    } catch (error) {
        console.error("Database error:", error.message);
    } finally {
        await pool.end();
    }
}

checkTables();