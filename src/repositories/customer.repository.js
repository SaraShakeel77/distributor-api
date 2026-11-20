
const customers = new Map();

const create = (customer) => {
    customers.set(customer.id, customer);
    return customer;
};

const findAll = () => {
    return Array.from(customers.values());
};

const findById = (id) => {
    return customers.get(id);
};

const findByEmail = (email) => {
    return Array.from(customers.values()).find(
        (customer) => customer.email === email
    );
};

const update = (id, updatedData) => {
    const customer = customers.get(id);

    if (!customer) {
        return null;
    }

    const updatedCustomer = {
        ...customer,
        ...updatedData,
    };

    customers.set(id, updatedCustomer);
    return updatedCustomer;
};

const remove = (id) => {
    return customers.delete(id);
};

module.exports = {
    create,
    findAll,
    findById,
    findByEmail,
    update,
    remove,
};
