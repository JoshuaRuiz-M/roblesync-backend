import { z } from "zod";

export const createBrandsSchema = z.strictObject({
    code: z.string().trim().min(1).max(50),

    name: z.string().trim().min(1).max(150),

    description: z.string().trim().max(500).nullable().optional(),

    is_active: z.boolean().default(true),
});

export const updateBrandsSchema = createBrandsSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateBrandsInput = z.output<typeof createBrandsSchema>;
export type UpdateBrandsInput = z.output<typeof updateBrandsSchema>;
