
require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../src/config/db");
const userRepository = require("../src/repositories/user.repository");

const seedAdmin = async () => {
    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD;

    // Check environment variables
    if (!email || !password) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
    }

    if (password.length < 8) {
        throw new Error("Admin password must be at least 8 characters");
    }

    // Check if admin email already exists
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        console.log("User already exists. No admin created.");
        return;
    }

    // Hash admin password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create ADMIN account
    await userRepository.create({
        email,
        passwordHash,
        role: "ADMIN",
        customerId: null,
    });

    console.log("Admin account created successfully!");
};

seedAdmin()
    .catch((error) => {
        console.error("Admin seeding failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
