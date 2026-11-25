
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/user.repository");

// Register a new user
const register = async (userData) => {
    const { email, password, customerId } = userData;

    // Validate minimum password length
    if (typeof password !== "string" || password.length < 8) {
        const error = new Error(
            "Password must be at least 8 characters long"
        );
        error.statusCode = 400;
        throw error;
    }

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with default role
    const newUser = await userRepository.create({
        email,
        passwordHash,
        role: "DISTRIBUTOR",
        customerId,
    });

    // Remove password hash from response
    const { password_hash, ...safeUser } = newUser;

    return safeUser;
};

// Login an existing user
const login = async (email, password) => {

    // Find user by email
    const user = await userRepository.findByEmail(email);

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // Ensure JWT secret is configured
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    // Generate JWT
    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1hr",
        }
    );

    // Return access token and safe user information
    return {
        accessToken: token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            customerId: user.customer_id,
        },
    };
};

module.exports = {
    register,
    login,
};
