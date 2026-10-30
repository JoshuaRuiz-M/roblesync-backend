import { z } from "zod";

export const createProductsSchema = z.strictObject({
    brand_id: z.number().int().positive(),
    product_line_id: z.number().int().positive(),
    unit_of_measure_id: z.number().int().positive(),
    sku: z.string().max(50),
    barcode: z.string().max(50),
    name: z.string().max(200),
    description: z.string().max(1000).optional(),
    weight: z.number().optional(),
    average_cost: z.number().positive(),
    list_price: z.number().positive(),
    minimum_stock: z.number().positive(),
    maximum_stock: z.number().positive(),
    reorder_point: z.number().positive(),
    tracks_expiration: z.boolean(),
    is_active: z.boolean(),
});

export const updateProductsSchema = createProductsSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export const createProductSupplierSchema = z.object({
    supplier_id: z.number().int().positive(),
    is_preferred: z.boolean().default(false),
    is_active: z.boolean().default(true),
});

export const updateProductSupplierSchema = z
    .object({
        is_preferred: z.boolean().optional(),
        is_active: z.boolean().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, "Debe proporcionar al menos un campo");

export const productSupplierParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
    supplierId: z.coerce.number().int().positive(),
});

export type CreateProductSupplierInput = z.input<typeof createProductSupplierSchema>;

export type UpdateProductSupplierInput = z.infer<typeof updateProductSupplierSchema>;

export type CreateProductsInput = z.output<typeof createProductsSchema>;
export type UpdateProductsInput = z.output<typeof updateProductsSchema>;
