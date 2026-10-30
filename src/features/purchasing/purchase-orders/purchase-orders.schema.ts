import { z } from "zod";

export const purchaseOrderDetailSchema = z
    .object({
        product_id: z.number().int().positive(),

        quantity: z.number().positive().multipleOf(0.001),

        unit_cost: z.number().nonnegative().multipleOf(0.0001),

        discount_amount: z.number().nonnegative().multipleOf(0.01).default(0),
    })
    .strict()
    .superRefine((detail, ctx) => {
        const grossAmount = detail.quantity * detail.unit_cost;

        if (detail.discount_amount > grossAmount + 0.000001) {
            ctx.addIssue({
                code: "custom",
                path: ["discount_amount"],
                message: "El descuento no puede superar el importe del producto.",
            });
        }
    });

export const purchaseOrderDetailsSchema = z
    .array(purchaseOrderDetailSchema)
    .min(1, "La orden debe contener al menos un producto.")
    .superRefine((details, ctx) => {
        const productIds = new Set<number>();

        details.forEach((detail, index) => {
            if (productIds.has(detail.product_id)) {
                ctx.addIssue({
                    code: "custom",
                    path: [index, "product_id"],
                    message: "El producto ya está incluido en la orden.",
                });
            }

            productIds.add(detail.product_id);
        });
    });

export const createPurchaseOrderSchema = z
    .object({
        supplier_id: z.number().int().positive(),

        expected_date: z.iso.date().nullable().optional(),

        notes: z.string().trim().max(500).nullable().optional(),

        details: purchaseOrderDetailsSchema,
    })
    .strict();

export const updatePurchaseOrderSchema = z
    .object({
        supplier_id: z.number().int().positive().optional(),

        expected_date: z.iso.date().nullable().optional(),

        notes: z.string().trim().max(500).nullable().optional(),

        details: purchaseOrderDetailsSchema.optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe proporcionar al menos un campo para actualizar.",
    });

export const purchaseOrderIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreatePurchaseOrderInput = z.input<typeof createPurchaseOrderSchema>;
export type UpdatePurchaseOrderInput = z.input<typeof updatePurchaseOrderSchema>;
