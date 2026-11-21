
const customerRepository = require("../repositories/customer.repository");
const AppError = require("../Errors/AppError");

// Handle PostgreSQL duplicate email error
const handleDatabaseError = (error) => {
    if (error.code === "23505") {
        throw new AppError(
            "Email already exists",
            409,
            "DUPLICATE_EMAIL"
        );
    }

    throw error;
};

// Create Customer
const createCustomer = async (customerData) => {
    const customer = {
        ...customerData,
        email: customerData.email.toLowerCase(),
    };

    try {
        return await customerRepository.create(customer);
    } catch (error) {
        handleDatabaseError(error);
    }
};

// Get All Customers
const getAllCustomers = async () => {
    return await customerRepository.findAll();
};

// Get Customer By ID
const getCustomerById = async (id) => {
    const customer = await customerRepository.findById(id);

    if (!customer) {
        throw new AppError(
            "Customer not found",
            404,
            "CUSTOMER_NOT_FOUND"
        );
    }

    return customer;
};

// Update Customer
const updateCustomer = async (id, updatedData) => {
    const existingCustomer = await customerRepository.findById(id);

    if (!existingCustomer) {
        throw new AppError(
            "Customer not found",
            404,
            "CUSTOMER_NOT_FOUND"
        );
    }

    const customerData = {
        ...updatedData,
    };

    if (customerData.email) {
        customerData.email = customerData.email.toLowerCase();
    }

    try {
        return await customerRepository.update(id, customerData);
    } catch (error) {
        handleDatabaseError(error);
    }
};

// Delete Customer
const deleteCustomer = async (id) => {
    const existingCustomer = await customerRepository.findById(id);

    if (!existingCustomer) {
        throw new AppError(
            "Customer not found",
            404,
            "CUSTOMER_NOT_FOUND"
        );
    }

    return await customerRepository.remove(id);
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};
