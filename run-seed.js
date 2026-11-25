
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("./src/config/db");

async function runSeed() {
    try {
        const seedPath = path.join(__dirname, "db", "seed.sql");
        const seedSQL = fs.readFileSync(seedPath, "utf8");

        await pool.query(seedSQL);

        console.log("Seed data inserted successfully!");

        const products = await pool.query(`
            SELECT COUNT(*) 
            FROM products
            WHERE sku IN (
                'BEV-001', 'BEV-002', 'BEV-003', 'BEV-004', 'BEV-005',
                'SNK-001', 'SNK-002', 'SNK-003', 'SNK-004', 'SNK-005',
                'HOM-001', 'HOM-002', 'HOM-003', 'HOM-004', 'HOM-005'
            )
        `);

        const inventory = await pool.query(`
            SELECT COUNT(*)
            FROM inventory i
            JOIN products p ON p.id = i.product_id
            WHERE p.sku LIKE 'BEV-%'
               OR p.sku LIKE 'SNK-%'
               OR p.sku LIKE 'HOM-%'
        `);

        const customers = await pool.query(
            "SELECT COUNT(*) FROM customers"
        );

        console.log("Seed products:", products.rows[0].count);
        console.log("Inventory records:", inventory.rows[0].count);
        console.log("Existing customers:", customers.rows[0].count);

    } catch (error) {
        console.error("Seed error:", error.message);
    } finally {
        await pool.end();
    }
}

runSeed();
