import { z } from "zod";

export const warehouseTransferDetailSchema = z
    .object({
        product_id: z.number().int().positive(),

        batch_id: z.number().int().positive(),

        quantity: z.number().positive().multipleOf(0.001),
    })
    .strict();

export const warehouseTransferDetailsSchema = z
    .array(warehouseTransferDetailSchema)
    .min(1, "La transferencia debe contener al menos un producto.")
    .superRefine((details, ctx) => {
        const batchIds = new Set<number>();

        details.forEach((detail, index) => {
            if (batchIds.has(detail.batch_id)) {
                ctx.addIssue({
                    code: "custom",
                    path: [index, "batch_id"],
                    message: "El lote ya está incluido en la transferencia.",
                });
            }

            batchIds.add(detail.batch_id);
        });
    });

export const createWarehouseTransferSchema = z
    .object({
        source_warehouse_id: z.number().int().positive(),

        destination_warehouse_id: z.number().int().positive(),

        notes: z.string().trim().max(500).nullable().optional(),

        details: warehouseTransferDetailsSchema,
    })
    .strict()
    .refine((data) => data.source_warehouse_id !== data.destination_warehouse_id, {
        path: ["destination_warehouse_id"],
        message: "La bodega de destino debe ser diferente a la de origen.",
    });

export const updateWarehouseTransferSchema = z
    .object({
        source_warehouse_id: z.number().int().positive().optional(),

        destination_warehouse_id: z.number().int().positive().optional(),

        notes: z.string().trim().max(500).nullable().optional(),

        details: warehouseTransferDetailsSchema.optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe proporcionar al menos un campo para actualizar.",
    })
    .refine(
        (data) =>
            data.source_warehouse_id === undefined ||
            data.destination_warehouse_id === undefined ||
            data.source_warehouse_id !== data.destination_warehouse_id,
        {
            path: ["destination_warehouse_id"],
            message: "La bodega de destino debe ser diferente a la de origen.",
        },
    );

export const warehouseTransferIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateWarehouseTransferInput = z.input<typeof createWarehouseTransferSchema>;

export type UpdateWarehouseTransferInput = z.input<typeof updateWarehouseTransferSchema>;
