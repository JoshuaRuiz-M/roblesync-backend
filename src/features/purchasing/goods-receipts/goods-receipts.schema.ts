import { z } from "zod";

const positiveIdSchema = z.number().int().positive();

const nullableTextSchema = z.string().trim().max(500).nullable();

const dateSchema = z.iso.date();

export const createGoodsReceiptDetailSchema = z
    .object({
        purchase_order_detail_id: positiveIdSchema,

        quantity_received: z
            .number()
            .positive()
            .refine(
                (value) => Number.isInteger(value * 1000),
                "La cantidad admite un máximo de 3 decimales.",
            ),

        batch_number: z.string().trim().min(1).max(100).nullish(),

        manufacturing_date: dateSchema.nullish(),

        expiration_date: dateSchema.nullish(),
    })
    .strict()
    .refine(
        (data) =>
            !data.manufacturing_date ||
            !data.expiration_date ||
            data.manufacturing_date <= data.expiration_date,
        {
            message: "La fecha de fabricación no puede ser posterior a la fecha de vencimiento.",
            path: ["expiration_date"],
        },
    );

export const createGoodsReceiptSchema = z
    .object({
        purchase_order_id: positiveIdSchema,

        warehouse_id: positiveIdSchema,

        notes: nullableTextSchema.optional(),

        details: z
            .array(createGoodsReceiptDetailSchema)
            .min(1, "Debe agregar al menos un producto a la recepción."),
    })
    .strict();

export const updateGoodsReceiptSchema = z
    .object({
        warehouse_id: positiveIdSchema.optional(),

        notes: nullableTextSchema.optional(),

        details: z
            .array(createGoodsReceiptDetailSchema)
            .min(1, "Debe agregar al menos un producto a la recepción.")
            .optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );
