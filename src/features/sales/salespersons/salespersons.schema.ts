import { z } from "zod";

export const createSalespersonsSchema = z.strictObject({
    user_id: z.number().int().positive(),

    employee_code: z.string().trim().min(1).max(30),

    phone: z.string().trim().max(30).nullable().optional(),

    is_active: z.boolean().default(true),
});

export const updateSalespersonsSchema = createSalespersonsSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateSalespersonsInput = z.output<typeof createSalespersonsSchema>;
export type UpdateSalespersonsInput = z.output<typeof updateSalespersonsSchema>;
