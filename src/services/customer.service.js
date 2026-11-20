
const customerRepository = require("../repositories/customer.repository");
const AppError = require("../Errors/AppError");

// Create Customer
const createCustomer = (customerData) => {
    const email = customerData.email.toLowerCase();

    const existingEmail = customerRepository.findByEmail(email);

    if (existingEmail) {
        throw new AppError("Email already exists", 409, "DUPLICATE_EMAIL");
    }

    const customer = {
        id: require("crypto").randomUUID(),
        ...customerData,
        email,
        status: customerData.status || "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    return customerRepository.create(customer);
};

// Get All Customers
const getAllCustomers = () => {
    return customerRepository.findAll();
};
// Get Customer By ID
const getCustomerById = (id) => {
    const customer = customerRepository.findById(id);

    if (!customer) {
        throw new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND");
    }

    return customer;
};

// Update Customer
const updateCustomer = (id, updatedData) => {
    const existingCustomer = customerRepository.findById(id);

    if (!existingCustomer) {
        throw new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND");
    }

    const customer = customerRepository.update(id, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
    });

    return customer;
};

// Delete Customer
const deleteCustomer = (id) => {
    const existingCustomer = customerRepository.findById(id);

    if (!existingCustomer) {
        throw new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND");
    }

    customerRepository.remove(id);
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};

