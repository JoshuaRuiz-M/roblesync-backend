import { z } from "zod";

export const priceListDetailSchema = z.object({
    product_id: z.number().int().positive(),
    unit_price: z.number().finite().min(0).max(999999.9999),
});

const detailsSchema = z.array(priceListDetailSchema).superRefine((details, ctx) => {
    const products = new Set<number>();

    details.forEach((detail, index) => {
        if (products.has(detail.product_id)) {
            ctx.addIssue({
                code: "custom",
                path: [index, "product_id"],
                message: "El producto está duplicado en la lista",
            });
        }

        products.add(detail.product_id);
    });
});

export const createPriceListSchema = z.object({
    code: z.string().trim().min(1).max(50),
    name: z.string().trim().min(1).max(150),
    description: z.string().trim().max(500).nullish(),
    is_active: z.boolean().default(true),
    details: detailsSchema.min(1, {
        message: "Debe agregar al menos un producto",
    }),
});

export const updatePriceListSchema = z
    .object({
        code: z.string().trim().min(1).max(50).optional(),
        name: z.string().trim().min(1).max(150).optional(),
        description: z.string().trim().max(500).nullish(),
        is_active: z.boolean().optional(),
        details: detailsSchema.optional(),
    })
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "Debe proporcionar al menos un campo para actualizar",
    });
