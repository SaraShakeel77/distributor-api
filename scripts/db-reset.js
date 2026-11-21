
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

const resetDatabase = async () => {
    let client;

    try {
        client = await pool.connect();

        console.log("Connected to PostgreSQL.");

        await client.query("BEGIN");

        // Drop all existing public tables
        await client.query(`
            DO $$ DECLARE
                table_record RECORD;
            BEGIN
                FOR table_record IN
                    SELECT tablename
                    FROM pg_tables
                    WHERE schemaname = 'public'
                LOOP
                    EXECUTE format(
                        'DROP TABLE IF EXISTS public.%I CASCADE',
                        table_record.tablename
                    );
                END LOOP;
            END $$;
        `);

        console.log("Existing tables dropped.");

        // Execute schema.sql
        const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
        const schema = fs.readFileSync(schemaPath, "utf8");

        await client.query(schema);

        console.log("schema.sql executed successfully.");

        // Execute seed.sql only if it exists
        const seedPath = path.join(__dirname, "..", "db", "seed.sql");

        if (fs.existsSync(seedPath)) {
            const seed = fs.readFileSync(seedPath, "utf8");
            await client.query(seed);

            console.log("seed.sql executed successfully.");
        } else {
            console.log("seed.sql not found. Skipping seed.");
        }

        await client.query("COMMIT");

        console.log("Database reset completed successfully.");

    } catch (error) {
        if (client) {
            await client.query("ROLLBACK");
        }

        console.error("Database reset failed:", error.message);
        process.exitCode = 1;

    } finally {
        if (client) {
            client.release();
        }

        await pool.end();
    }
};

resetDatabase();
