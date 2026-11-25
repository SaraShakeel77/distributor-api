
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/authenticate");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route
router.get("/me", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user
    });
});

module.exports = router;
