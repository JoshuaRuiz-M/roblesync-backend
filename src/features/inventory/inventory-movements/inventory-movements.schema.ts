import { z } from "zod";

export const createInventoryMovementsSchema = z.strictObject({
    warehouse_id: z.number().int().positive(),
    product_id: z.number().int().positive(),
    batch_id: z.number().int().positive().nullable().optional(),
    movement_type: z.string().trim().min(1).max(30),
    movement_date: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de movimiento debe tener el formato YYYY-MM-DD."),
    quantity: z.number().positive(),
    unit_cost: z.number().positive(),
    total_cost: z.number().positive(),
    balance_quantity: z.number().positive(),
    balance_value: z.number().positive(),
    reference_type: z.string().trim().max(50).nullable().optional(),
    reference_id: z.number().int().positive().nullable().optional(),
    notes: z.string().trim().max(500).nullable().optional(),
});

export const updateInventoryMovementsSchema = createInventoryMovementsSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateInventoryMovementsInput = z.output<typeof createInventoryMovementsSchema>;
export type UpdateInventoryMovementsInput = z.output<typeof updateInventoryMovementsSchema>;
