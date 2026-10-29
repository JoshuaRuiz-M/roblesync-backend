import { z } from "zod";

export const createUnitsOfMeasureSchema = z.strictObject({
    code: z.string().trim().min(1).max(50),

    name: z.string().trim().min(1).max(150),

    abbreviation: z.string().trim().min(1).max(20).nullable().optional(),

    description: z.string().trim().max(500).nullable().optional(),

    is_active: z.boolean().default(true),
});

export const updateUnitsOfMeasureSchema = createUnitsOfMeasureSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateUnitsOfMeasureInput = z.output<typeof createUnitsOfMeasureSchema>;
export type UpdateUnitsOfMeasureInput = z.output<typeof updateUnitsOfMeasureSchema>;
