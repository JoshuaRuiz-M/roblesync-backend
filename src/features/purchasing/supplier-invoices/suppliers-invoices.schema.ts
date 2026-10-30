import { z } from "zod";

export const createSupplierInvoicesSchema = z.strictObject({
    supplier_id: z.number().int().positive(),
    purchase_order_id: z.number().int().positive(),
    invoice_number: z.string().max(50),
    invoice_date: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de factura debe tener el formato YYYY-MM-DD."),
    due_date: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de factura debe tener el formato YYYY-MM-DD."),
    subtotal: z.number().nonnegative(),
    tax_amount: z.number().nonnegative(),
    total_amount: z.number().nonnegative(),
    status: z.enum(["REGISTERED", "CANCELLED"]),
    notes: z.string().max(500).optional().nullable(),
});

export const updateSupplierInvoicesSchema = createSupplierInvoicesSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "Debe proporcionar al menos un campo para actualizar.",
    );

export type CreateSupplierInvoicesInput = z.output<typeof createSupplierInvoicesSchema>;
export type UpdateSupplierInvoicesInput = z.output<typeof updateSupplierInvoicesSchema>;
