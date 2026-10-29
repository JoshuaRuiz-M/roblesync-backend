import { z } from "zod";

export const createWarehousesSchema = z.strictObject({
    code: z.string().trim().min(1).max(50),

    name: z.string().trim().min(1).max(150),

    description: z.string().trim().max(500).nullable().optional(),

    address: z.string().trim().max(300).nullable().optional(),

    is_active: z.boolean().default(true),
});

export const updateWarehousesSchema = createWarehousesSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateWarehousesInput = z.output<typeof createWarehousesSchema>;
export type UpdateWarehousesInput = z.output<typeof updateWarehousesSchema>;
