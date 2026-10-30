import { z } from "zod";

export const salesOrderDetailSchema = z
    .object({
        product_id: z.number().int().positive(),

        quantity: z.number().positive().multipleOf(0.001),

        unit_price: z.number().nonnegative().multipleOf(0.0001),

        discount_amount: z.number().nonnegative().multipleOf(0.01).default(0),
    })
    .strict()
    .superRefine((detail, ctx) => {
        const grossAmount = detail.quantity * detail.unit_price;

        if (detail.discount_amount > grossAmount + 0.000001) {
            ctx.addIssue({
                code: "custom",
                path: ["discount_amount"],
                message: "El descuento no puede superar el importe del producto.",
            });
        }
    });

export const salesOrderDetailsSchema = z
    .array(salesOrderDetailSchema)
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

export const createSalesOrderSchema = z
    .object({
        customer_id: z.number().int().positive(),

        salesperson_id: z.number().int().positive(),

        warehouse_id: z.number().int().positive(),

        notes: z.string().trim().max(500).nullable().optional(),

        details: salesOrderDetailsSchema,
    })
    .strict();

export const updateSalesOrderSchema = z
    .object({
        customer_id: z.number().int().positive().optional(),

        salesperson_id: z.number().int().positive().optional(),

        warehouse_id: z.number().int().positive().optional(),

        notes: z.string().trim().max(500).nullable().optional(),

        details: salesOrderDetailsSchema.optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe proporcionar al menos un campo para actualizar.",
    });

export const salesOrderIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateSalesOrderInput = z.input<typeof createSalesOrderSchema>;

export type UpdateSalesOrderInput = z.input<typeof updateSalesOrderSchema>;
