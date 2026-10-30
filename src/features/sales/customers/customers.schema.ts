import { z } from "zod";

export const createCustomersSchema = z.strictObject({
    customer_code: z.string().trim().min(1).max(50),

    tax_id: z.string().trim().min(1).max(20),

    business_name: z.string().trim().min(1).max(200),

    customer_type: z.enum(["WHOLESALE", "RETAIL", "CHAIN"]).default("RETAIL"),

    contact_name: z.string().trim().max(150).nullable().optional(),

    phone: z.string().trim().max(30).nullable().optional(),

    email: z.string().trim().email().max(255).nullable().optional(),

    address: z.string().trim().max(300).nullable().optional(),

    salesperson_id: z.number().int().positive(),

    price_list_id: z.number().int().positive(),

    credit_days: z.number().int().nonnegative(),

    credit_limit: z.number().nonnegative(),

    is_credit_blocked: z.boolean(),

    is_active: z.boolean().default(true),
});

export const updateCustomersSchema = createCustomersSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateCustomersInput = z.output<typeof createCustomersSchema>;
export type UpdateCustomersInput = z.output<typeof updateCustomersSchema>;
