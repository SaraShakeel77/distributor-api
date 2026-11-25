
const { z } = require("zod");

// GET products query validation
const productQuerySchema = z.object({
    category: z.string()
        .trim()
        .optional()
        .transform(value => value || undefined),

    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),

    page: z.string()
        .regex(/^[1-9]\d*$/, "Page must be a positive integer")
        .default("1")
        .transform(Number),

    limit: z.string()
        .regex(/^[1-9]\d*$/, "Limit must be a positive integer")
        .default("20")
        .transform(Number)
        .refine((value) => value <= 100, {
            message: "Limit cannot exceed 100",
        }),
}).strict();

// POST product validation
const createProductSchema = z.object({
    name: z.string().trim().min(1),
    sku: z.string().trim().min(1),
    description: z.string().optional(),
    category: z.string().optional(),
    price: z.coerce.number().min(0),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
}).strict();

// PUT product validation
const updateProductSchema = createProductSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one field is required"
    );

// PUT inventory validation
const updateInventorySchema = z.object({
    warehouse: z.string().trim().min(1),
    availableQuantity: z.number().int().min(0).optional(),
    reservedQuantity: z.number().int().min(0).optional(),
}).strict().refine(
    (data) =>
        data.availableQuantity !== undefined ||
        data.reservedQuantity !== undefined,
    "At least one quantity field is required"
);

module.exports = {
    productQuerySchema,
    createProductSchema,
    updateProductSchema,
    updateInventorySchema,
};
