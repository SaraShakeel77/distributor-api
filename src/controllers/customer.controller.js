
const customerService = require("../services/customer.service");

const createCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.createCustomer(req.body);

        return res.status(201).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await customerService.getAllCustomers();

        return res.status(200).json({
            success: true,
            data: customers,
        });
    } catch (error) {
        next(error);
    }
};

const getCustomerById = async (req, res, next) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);

        return res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

const updateCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.updateCustomer(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

const deleteCustomer = async (req, res, next) => {
    try {
        await customerService.deleteCustomer(req.params.id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};
