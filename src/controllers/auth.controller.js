
const authService = require("../services/auth.service");

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
};
