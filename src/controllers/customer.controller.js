
const customerService = require("../services/customer.service");

const createCustomer = (req, res, next) => {
    try {
        const customer = customerService.createCustomer(req.body);

        return res.status(201).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

const getAllCustomers = (req, res, next) => {
    try {
        const customers = customerService.getAllCustomers();

        return res.status(200).json({
            success: true,
            data: customers,
        });
    } catch (error) {
        next(error);
    }
};

const getCustomerById = (req, res, next) => {
    try {
        const customer = customerService.getCustomerById(req.params.id);

        return res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

const updateCustomer = (req, res, next) => {
    try {
        const customer = customerService.updateCustomer(
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

const deleteCustomer = (req, res, next) => {
    try {
        customerService.deleteCustomer(req.params.id);

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
