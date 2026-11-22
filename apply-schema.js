
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function applySchema() {
    const client = await pool.connect();

    try {
        console.log("Connected to PostgreSQL.");

        await client.query("BEGIN");

        const schemaPath = path.join(
            __dirname,
            "db",
            "schema.sql"
        );

        const schema = fs.readFileSync(schemaPath, "utf8");

        await client.query(schema);

        await client.query("COMMIT");

        console.log("Schema applied successfully!");
        console.log("Existing tables and records preserved.");

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Schema application failed:", error.message);

    } finally {
        client.release();
        await pool.end();
    }
}

applySchema();
