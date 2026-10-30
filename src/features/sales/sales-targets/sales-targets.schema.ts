import { z } from "zod";

export const createSalesTargetsSchema = z.strictObject({
    salesperson_id: z.number().int().positive(),

    target_year: z.number().int().min(2000).max(2100),

    target_month: z.number().int().min(1).max(12),

    target_amount: z.number().positive(),
});

export const updateSalesTargetsSchema = createSalesTargetsSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateSalesTargetsInput = z.output<typeof createSalesTargetsSchema>;
export type UpdateSalesTargetsInput = z.output<typeof updateSalesTargetsSchema>;
