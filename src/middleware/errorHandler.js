
const errorHandler = (err, req, res, next) => {
    // Log actual error for debugging
    console.log("ACTUAL ERROR:", err);
    console.log("ERROR MESSAGE:", err.message);
    console.log("ERROR CODE:", err.code);
    console.log("ERROR STACK:", err.stack);


    // Handle known application errors
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code || "APPLICATION_ERROR",
        });
    }

    // PostgreSQL connection / availability errors
    const databaseConnectionErrors = [
        "ECONNREFUSED",
        "ECONNRESET",
        "ETIMEDOUT",
        "ENOTFOUND",
        "57P01",
        "57P02",
        "57P03",
    ];

    if (databaseConnectionErrors.includes(err.code)) {
        return res.status(503).json({
            success: false,
            message: "Database service is currently unavailable",
            code: "DATABASE_UNAVAILABLE",
        });
    }

    // Handle unexpected errors
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
    });
};

module.exports = errorHandler;
