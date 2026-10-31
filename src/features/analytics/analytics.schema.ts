import { z } from "zod";

export const inventoryMovementTypeSchema = z.enum([
    "PURCHASE_RECEIPT",
    "SALE_DISPATCH",
    "TRANSFER_IN",
    "TRANSFER_OUT",
    "ADJUSTMENT_IN",
    "ADJUSTMENT_OUT",
    "RETURN_IN",
    "RETURN_OUT",
]);

const optionalPositiveId = z.coerce.number().int().positive().optional();

const optionalDate = z.iso.date().optional();

const dateRangeValidation = (data: { start_date?: string; end_date?: string }) =>
    !data.start_date || !data.end_date || data.start_date <= data.end_date;

export const kardexQuerySchema = z
    .strictObject({
        product_id: optionalPositiveId,
        warehouse_id: optionalPositiveId,
        batch_id: optionalPositiveId,
        movement_type: inventoryMovementTypeSchema.optional(),
        start_date: optionalDate,
        end_date: optionalDate,
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
    })
    .refine(dateRangeValidation, {
        message: "La fecha inicial no puede ser mayor que la fecha final.",
        path: ["end_date"],
    });

export const kardexSummaryQuerySchema = z
    .strictObject({
        product_id: z.coerce.number().int().positive(),
        warehouse_id: z.coerce.number().int().positive(),
        start_date: optionalDate,
        end_date: optionalDate,
    })
    .refine(dateRangeValidation, {
        message: "La fecha inicial no puede ser mayor que la fecha final.",
        path: ["end_date"],
    });

export type KardexQuery = z.output<typeof kardexQuerySchema>;
export type KardexSummaryQuery = z.output<typeof kardexSummaryQuerySchema>;

const dashboardDateSchema = z.iso.date();

export const dashboardDateFiltersSchema = z
    .strictObject({
        start_date: dashboardDateSchema.optional(),
        end_date: dashboardDateSchema.optional(),
    })
    .refine((data) => !data.start_date || !data.end_date || data.start_date <= data.end_date, {
        message: "La fecha inicial no puede ser mayor que la fecha final.",
        path: ["end_date"],
    });

export const dashboardTopProductsSchema = dashboardDateFiltersSchema.safeExtend({
    top: z.coerce.number().int().min(1).max(100).default(5),
});

export const dashboardInventoryAlertsSchema = z.strictObject({
    expiration_days: z.coerce.number().int().min(0).max(365).default(30),
    top: z.coerce.number().int().min(1).max(100).default(20),
});
