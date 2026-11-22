
const { z } = require("zod");

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

module.exports = {
    productQuerySchema,
};
