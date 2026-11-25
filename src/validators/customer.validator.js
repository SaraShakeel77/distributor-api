
const { z } = require("zod");

const customerSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),

    email: z.string().trim().email("Invalid email address"),

    phone: z.string().optional(),

    company: z.string().trim().min(1, "Company is required"),

    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
}).strict();

module.exports = {
    customerSchema,
};
