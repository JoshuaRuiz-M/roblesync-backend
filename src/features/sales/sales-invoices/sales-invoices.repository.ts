import { BaseRepository } from "../../../shared/repositories/base.repository";
import { AppError } from "../../../shared/errors/app-error";
import { HttpStatus } from "../../../shared/constants/http-status";

import { InventoryRepository } from "../../inventory/repositories/inventory.repository";

import { createSalesInvoiceSchema, updateSalesInvoiceSchema } from "./sales-invoices.schema";

import type {
    SalesInvoice,
    SalesInvoiceDetail,
    CreateSalesInvoice,
    UpdateSalesInvoice,
} from "./sales-invoices.types";

type SalesOrderRow = {
    sales_order_id: number;
    customer_id: number;
    salesperson_id: number;
    warehouse_id: number;
    status: string;
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
};

type SalesOrderDetailRow = {
    sales_order_detail_id: number;
    product_id: number;
    quantity: number;
    quantity_reserved: number;
    unit_price: number;
    discount_amount: number;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
};

export class SalesInvoicesRepository extends BaseRepository<
    SalesInvoice,
    CreateSalesInvoice,
    UpdateSalesInvoice
> {
    constructor() {
        super({
            schema: "sales",
            table: "sales_invoices",
            primaryKey: "sales_invoice_id",
            columns: [
                "sales_invoice_id",
                "sales_order_id",
                "customer_id",
                "salesperson_id",
                "invoice_series",
                "invoice_number",
                "dte_uuid",
                "invoice_date",
                "due_date",
                "subtotal",
                "discount_amount",
                "tax_amount",
                "total_amount",
                "status",
                "cancellation_reason",
                "cancelled_at",
                "cancelled_by",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
            ],
            hasAuditFields: true,
            hasUserFields: true,
            schemas: {
                create: createSalesInvoiceSchema,
                update: updateSalesInvoiceSchema,
            },
        });
    }

    async findDetails(salesInvoiceId: number): Promise<SalesInvoiceDetail[]> {
        return this.db("sales.sales_invoice_details")
            .where("sales_invoice_id", salesInvoiceId)
            .select("*")
            .orderBy("sales_invoice_detail_id", "asc");
    }

    override async create(data: CreateSalesInvoice, user_id: number): Promise<SalesInvoice> {
        const validated = createSalesInvoiceSchema.parse(data);

        const invoiceId = await this.db.transaction(async (trx) => {
            // Bloquear la orden durante la emisión.
            const order = await trx("sales.sales_orders")
                .where("sales_order_id", validated.sales_order_id)
                .forUpdate()
                .first<SalesOrderRow>();

            if (!order) {
                throw new AppError(HttpStatus.NOT_FOUND, "La orden de venta no existe.");
            }

            if (order.status !== "RESERVED") {
                throw new AppError(
                    HttpStatus.CONFLICT,
                    "Solo se pueden facturar órdenes de venta reservadas.",
                );
            }

            const existingInvoice = await trx("sales.sales_invoices")
                .where("sales_order_id", order.sales_order_id)
                .first("sales_invoice_id");

            if (existingInvoice) {
                throw new AppError(
                    HttpStatus.CONFLICT,
                    "La orden de venta ya tiene una factura registrada.",
                );
            }

            const details = await trx("sales.sales_order_details")
                .where("sales_order_id", order.sales_order_id)
                .orderBy("product_id", "asc")
                .select<SalesOrderDetailRow[]>("*");

            if (details.length === 0) {
                throw new AppError(HttpStatus.CONFLICT, "La orden de venta no contiene productos.");
            }

            // Validar que todos los productos estén reservados.
            for (const detail of details) {
                const quantity = Number(detail.quantity);
                const reserved = Number(detail.quantity_reserved);

                if (quantity <= 0 || Math.round(quantity * 1000) !== Math.round(reserved * 1000)) {
                    throw new AppError(
                        HttpStatus.CONFLICT,
                        `El producto ${detail.product_id} no está completamente reservado.`,
                    );
                }
            }

            // Obtener los días de crédito del cliente.
            const customer = await trx("sales.customers")
                .where("customer_id", order.customer_id)
                .first("credit_days");

            if (!customer) {
                throw new AppError(
                    HttpStatus.NOT_FOUND,
                    "El cliente asociado a la orden no existe.",
                );
            }

            const creditDays = Number(customer.credit_days);

            if (!Number.isInteger(creditDays) || creditDays < 0) {
                throw new AppError(
                    HttpStatus.CONFLICT,
                    "Los días de crédito del cliente no son válidos.",
                );
            }

            // Utilizar la fecha UTC de SQL Server.
            const [{ invoice_date: invoiceDate }] = await trx.select({
                invoice_date: trx.raw("SYSUTCDATETIME()"),
            });

            const dueDate = new Date(invoiceDate);
            dueDate.setUTCDate(dueDate.getUTCDate() + creditDays);

            const dueDateString = dueDate.toISOString().slice(0, 10);

            // Crear la factura.
            const [created] = await trx("sales.sales_invoices")
                .insert({
                    sales_order_id: order.sales_order_id,
                    customer_id: order.customer_id,
                    salesperson_id: order.salesperson_id,
                    invoice_series: validated.invoice_series,
                    invoice_number: validated.invoice_number,
                    dte_uuid: validated.dte_uuid ?? null,
                    invoice_date: invoiceDate,
                    due_date: dueDateString,
                    subtotal: order.subtotal,
                    discount_amount: order.discount_amount,
                    tax_amount: order.tax_amount,
                    total_amount: order.total_amount,
                    status: "ISSUED",
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: user_id,
                })
                .returning("sales_invoice_id");

            const salesInvoiceId = Number(created.sales_invoice_id);

            const inventory = new InventoryRepository();

            // Registrar detalles y salidas de inventario.
            for (const detail of details) {
                const unitCost = await inventory.registerSalesIssue(trx, {
                    warehouse_id: Number(order.warehouse_id),
                    product_id: Number(detail.product_id),
                    quantity: Number(detail.quantity),
                    reference_id: salesInvoiceId,
                    user_id,
                });

                await trx("sales.sales_invoice_details").insert({
                    sales_invoice_id: salesInvoiceId,
                    product_id: detail.product_id,
                    quantity: detail.quantity,
                    unit_price: detail.unit_price,
                    unit_cost: unitCost,
                    discount_amount: detail.discount_amount,
                    subtotal: detail.subtotal,
                    tax_amount: detail.tax_amount,
                    total_amount: detail.total_amount,
                    created_at: trx.raw("SYSUTCDATETIME()"),
                    created_by: user_id,
                });

                // La reserva fue consumida por la salida.
                await trx("sales.sales_order_details")
                    .where("sales_order_detail_id", detail.sales_order_detail_id)
                    .update({
                        quantity_reserved: 0,
                        updated_at: trx.raw("SYSUTCDATETIME()"),
                        updated_by: user_id,
                    });
            }

            // Completar la orden.
            await trx("sales.sales_orders")
                .where("sales_order_id", order.sales_order_id)
                .update({
                    status: "COMPLETED",
                    updated_at: trx.raw("SYSUTCDATETIME()"),
                    updated_by: user_id,
                });

            return salesInvoiceId;
        });

        const invoice = await this.findById(invoiceId);

        if (!invoice) {
            throw new Error("La factura creada no pudo recuperarse.");
        }

        return invoice;
    }

    async cancel(id: number, reason: string, userId: number): Promise<SalesInvoice> {
        const cancellationReason = reason.trim();

        if (cancellationReason.length === 0 || cancellationReason.length > 500) {
            throw new AppError(
                HttpStatus.BAD_REQUEST,
                "El motivo de cancelación debe contener entre 1 y 500 caracteres.",
            );
        }

        const affectedRows = await this.db("sales.sales_invoices")
            .where("sales_invoice_id", id)
            .where("status", "ISSUED")
            .update({
                status: "CANCELLED",
                cancellation_reason: cancellationReason,
                cancelled_at: this.db.raw("SYSUTCDATETIME()"),
                cancelled_by: userId,
                updated_at: this.db.raw("SYSUTCDATETIME()"),
                updated_by: userId,
            });

        if (affectedRows === 0) {
            const existing = await this.findById(id);

            throw new AppError(
                existing ? HttpStatus.CONFLICT : HttpStatus.NOT_FOUND,
                existing ? "La factura ya está cancelada." : "La factura de venta no existe.",
            );
        }

        const invoice = await this.findById(id);

        if (!invoice) {
            throw new Error("La factura cancelada no pudo recuperarse.");
        }

        return invoice;
    }
}
