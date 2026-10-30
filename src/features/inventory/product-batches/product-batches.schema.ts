import { z } from "zod";

export const createproductBatchesSchema = z.strictObject({
    product_id: z.number().int().positive(),

    batch_number: z.string().trim().min(1).max(100),

    manufacturing_date: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de fabricación debe tener el formato YYYY-MM-DD."),

    expiration_date: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de expiración debe tener el formato YYYY-MM-DD."),

    is_active: z.boolean().default(true),
});

export const updateproductBatchesSchema = createproductBatchesSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateproductBatchesInput = z.output<typeof createproductBatchesSchema>;
export type UpdateproductBatchesInput = z.output<typeof updateproductBatchesSchema>;
