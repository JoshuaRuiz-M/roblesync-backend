import { z } from "zod";

export const createSuppliersSchema = z.strictObject({
    tax_id: z.string().min(1).max(20),
    business_name: z.string().min(1).max(200),
    contact_name: z.string().max(150).nullable().optional(),
    phone: z.string().max(30).nullable().optional(),
    email: z.string().email().max(255).nullable().optional(),
    address: z.string().max(300).nullable().optional(),
    credit_days: z.number().int().min(0),
    credit_limit: z.number().min(0),
    is_active: z.boolean().default(true),
});

export const updateSuppliersSchema = createSuppliersSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateSuppliersInput = z.output<typeof createSuppliersSchema>;
export type UpdateSuppliersInput = z.output<typeof updateSuppliersSchema>;
