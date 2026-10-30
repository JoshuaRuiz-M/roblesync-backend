import { z } from "zod";

export const createSalesInvoiceSchema = z.strictObject({
    sales_order_id: z.number().int().positive(),
    invoice_series: z.string().trim().min(1).max(50),
    invoice_number: z.string().trim().min(1).max(50),
    dte_uuid: z.string().trim().min(1).max(100).optional().nullable(),
});

export const updateSalesInvoiceSchema = createSalesInvoiceSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export const cancelSalesInvoiceSchema = z.strictObject({
    cancellation_reason: z.string().trim().min(1).max(500),
});

export type CreateSalesInvoiceInput = z.output<typeof createSalesInvoiceSchema>;
export type UpdateSalesInvoiceInput = z.output<typeof updateSalesInvoiceSchema>;
export type CancelSalesInvoiceInput = z.output<typeof cancelSalesInvoiceSchema>;
