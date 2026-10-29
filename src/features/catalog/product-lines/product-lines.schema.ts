import { z } from "zod";

export const createproductLinesSchema = z.strictObject({
    
    category_id: z.number().int().positive(),

    code: z.string().trim().min(1).max(50),

    name: z.string().trim().min(1).max(150),

    description: z.string().trim().max(500).nullable().optional(),

    is_active: z.boolean().default(true),
});

export const updateproductLinesSchema = createproductLinesSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateproductLinesInput = z.output<typeof createproductLinesSchema>;
export type UpdateproductLinesInput = z.output<typeof updateproductLinesSchema>;
